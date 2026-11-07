import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Apply authentication and admin middleware to all routes in this file
router.use(authMiddleware);
router.use(adminMiddleware);

// --- DASHBOARD --- //
router.get('/dashboard', async (req, res) => {
  try {
    const [userCount, tourCount, reservationCount, revenue] = await prisma.$transaction([
      prisma.user.count({ where: { role: 'user' } }),
      prisma.tour.count({ where: { status: 'active' } }),
      prisma.reservation.count({ where: { status: { not: 'cancelled' } } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'succeeded' },
      }),
    ]);
    res.json({
      users: userCount,
      tours: tourCount,
      reservations: reservationCount,
      revenue: revenue._sum.amount || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// --- TOUR MANAGEMENT --- //
router.get('/tours', async (req, res) => {
    try {
        const tours = await prisma.tour.findMany({
            include: {
                destination: { select: { name: true } },
                _count: { select: { reservations: true } }
            },
            orderBy: { created_at: 'desc' } 
        });
        const formattedTours = tours.map(({_count, destination, ...tour}) => ({
            ...tour,
            destination_name: destination ? destination.name : 'N/A',
            reservation_count: _count.reservations
        }));
        res.json(formattedTours);
    } catch (error) {
        console.error('Error fetching admin tours:', error);
        res.status(500).json({ message: 'Error fetching admin tours' });
    }
});

router.get('/tours/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tour = await prisma.tour.findUnique({
            where: { id },
            include: {
                destination: { select: { name: true } },
            }
        });
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        
        // Map backend fields to frontend expected format
        const getDifficultyString = (level) => {
            switch (level) {
                case 1: return 'easy';
                case 2: return 'moderate';
                case 3: return 'challenging';
                default: return null;
            }
        };

        const formattedTour = {
            id: tour.id,
            name: tour.title, // Backend'de title, frontend'de name
            title: tour.title,
            description: tour.description,
            price: tour.price_adult, // Backend'de price_adult, frontend'de price
            duration: tour.duration_hours, // Backend'de duration_hours, frontend'de duration
            max_group_size: tour.max_participants, // Backend'de max_participants, frontend'de max_group_size
            destination_id: tour.destination_id,
            difficulty: getDifficultyString(tour.difficulty_level), // Backend'de difficulty_level (int), frontend'de difficulty (string)
            tour_type: tour.tour_type,
            image_url: tour.images ? (Array.isArray(tour.images) ? tour.images[0] : tour.images) : "",
            start_date: tour.start_date,
            end_date: tour.end_date,
            highlights: tour.includes || [],
            departure_location: tour.departure_location,
            departure_time: tour.departure_time,
            return_time: tour.return_time,
            included: tour.includes || [],
            excluded: tour.excludes || [],
            benefits: tour.benefits || [],
            itinerary: tour.itinerary || [],
            is_active: tour.status === 'active',
            deposit: tour.deposit || 0,
            status: tour.status,
            destination_name: tour.destination?.name || 'N/A'
        };
        
        res.json(formattedTour);
    } catch (error) {
        console.error(`Error fetching tour ${id}:`, error);
        res.status(500).json({ message: 'Error fetching tour' });
    }
});

router.post('/tours', async (req, res) => {
    try {
        console.log('POST /tours - Request body:', JSON.stringify(req.body, null, 2));
        
        // Frontend formatını backend formatına dönüştür
        const { 
            title, name, description, price, price_adult, duration, duration_hours,
            max_group_size, max_participants, destination_id, difficulty, difficulty_level,
            tour_type, image_url, images, start_date, end_date, highlights, includes,
            departure_location, departure_time, return_time, included, excluded, 
            benefits, itinerary, is_active, status, deposit, location,
            // Backend alanları
            slug, short_description, category_id, guide_id, min_participants, 
            price_child, price_currency, age_limit, featured, excludes, requirements, 
            cancellation_policy, metadata, seo_title, seo_description 
        } = req.body;

        // Frontend'den gelen verileri backend formatına dönüştür
        const tourTitle = title || name;
        const tourPrice = price_adult || price || 0;
        const tourDuration = duration_hours || duration || 1;
        const tourMaxParticipants = max_participants || max_group_size || 10;
        const tourDifficulty = difficulty_level || difficulty;
        const tourStatus = status || (is_active === false ? 'inactive' : 'active');
        const tourImages = images || (image_url ? [image_url] : []);
        const tourIncludes = includes || included || highlights || [];
        const tourExcludes = excludes || excluded || [];

        // Convert difficulty to integer (1=easy, 2=moderate, 3=challenging)
        const getDifficultyLevel = (diff) => {
            if (!diff) return null;
            switch (diff.toLowerCase()) {
                case 'easy': return 1;
                case 'moderate': return 2;
                case 'challenging': return 3;
                default: return null;
            }
        };

        // Use default category if not provided
        const finalCategoryId = category_id || '51638acc-0ee6-437b-8bd7-128f58145938'; // Cultural category as default
        const finalDifficultyLevel = getDifficultyLevel(tourDifficulty);
        
        // Generate unique slug
        const generateUniqueSlug = async (baseTitle) => {
            const baseSlug = baseTitle.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            
            let slug = baseSlug;
            let counter = 1;
            
            while (true) {
                const existingTour = await prisma.tour.findUnique({
                    where: { slug }
                });
                
                if (!existingTour) {
                    return slug;
                }
                
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
        };
        
        const finalSlug = slug || await generateUniqueSlug(tourTitle);
        
        console.log('POST /tours - Tour creation debug:');
        console.log('Original category_id:', category_id);
        console.log('finalCategoryId:', finalCategoryId);
        console.log('Original difficulty_level:', difficulty_level);
        console.log('Original difficulty:', difficulty);
        console.log('tourDifficulty:', tourDifficulty);
        console.log('finalDifficultyLevel:', finalDifficultyLevel);
        console.log('Generated slug:', finalSlug);

        // Basic validation for required fields
        if (!tourTitle || !description || !destination_id) {
            return res.status(400).json({ message: 'Missing required fields: title/name, description, destination_id are required.' });
        }

        const newTour = await prisma.tour.create({ 
            data: {
                title: tourTitle,
                slug: finalSlug,
                description,
                short_description,
                category_id: finalCategoryId,
                destination_id,
                guide_id,
                status: tourStatus,
                duration_hours: parseInt(tourDuration),
                max_participants: parseInt(tourMaxParticipants),
                min_participants: min_participants ? parseInt(min_participants) : 1,
                price_adult: parseFloat(tourPrice),
                price_child: price_child ? parseFloat(price_child) : 0.0,
                price_currency: price_currency || 'USD',
                difficulty_level: finalDifficultyLevel,
                age_limit,
                featured: featured || false,
                includes: tourIncludes,
                excludes: tourExcludes,
                // NOT: benefits, itinerary ve diğer schema'da olmayan field'lar kaldırıldı
                requirements,
                cancellation_policy,
                images: tourImages,
                metadata,
                seo_title,
                seo_description,
                created_by_id: req.user.id,
            }
        });
        
        // Frontend formatında döndür
        const getDifficultyString = (level) => {
            switch (level) {
                case 1: return 'easy';
                case 2: return 'moderate';
                case 3: return 'challenging';
                default: return null;
            }
        };

        const formattedTour = {
            id: newTour.id,
            name: newTour.title,
            title: newTour.title,
            description: newTour.description,
            price: newTour.price_adult,
            duration: newTour.duration_hours,
            max_group_size: newTour.max_participants,
            destination_id: newTour.destination_id,
            difficulty: getDifficultyString(newTour.difficulty_level),
            tour_type: newTour.tour_type,
            image_url: newTour.images ? (Array.isArray(newTour.images) ? newTour.images[0] : newTour.images) : "",
            start_date: newTour.start_date,
            end_date: newTour.end_date,
            highlights: newTour.includes || [],
            departure_location: newTour.departure_location,
            departure_time: newTour.departure_time,
            return_time: newTour.return_time,
            included: newTour.includes || [],
            excluded: newTour.excludes || [],
            benefits: newTour.benefits || [],
            itinerary: newTour.itinerary || [],
            is_active: newTour.status === 'active',
            deposit: newTour.deposit || 0,
            status: newTour.status
        };
        
        res.status(201).json(formattedTour);
    } catch (error) {
        console.error('Error creating tour:', error);
        res.status(500).json({ message: 'Error creating tour', error: error.message });
    }
});

router.put('/tours/:id', async (req, res) => {
    const { id } = req.params;
    console.log('=== PUT /tours/:id DEBUG START ===');
    console.log('Body received:', JSON.stringify(req.body, null, 2));
    try {
        // Frontend formatını backend formatına dönüştür
        const { 
            title, name, description, price, price_adult, duration, duration_hours,
            max_group_size, max_participants, destination_id, difficulty, difficulty_level,
            tour_type, image_url, images, start_date, end_date, highlights, includes,
            departure_location, departure_time, return_time, included, excluded, 
            benefits, itinerary, is_active, status, deposit, location,
            // Backend alanları
            slug, short_description, category_id, guide_id, min_participants, 
            price_child, price_currency, age_limit, featured, excludes, requirements, 
            cancellation_policy, metadata, seo_title, seo_description 
        } = req.body;

        // Frontend'den gelen verileri backend formatına dönüştür
        const tourTitle = title || name;
        const tourPrice = price_adult || price;
        const tourDuration = duration_hours || duration;
        const tourMaxParticipants = max_participants || max_group_size;
        const tourDifficulty = difficulty_level || difficulty;
        const tourStatus = status || (is_active === false ? 'inactive' : (is_active === true ? 'active' : undefined));
        const tourImages = images || (image_url ? [image_url] : undefined);
        const tourIncludes = includes || included || highlights;
        const tourExcludes = excludes || excluded;

        // Convert difficulty to integer (1=easy, 2=moderate, 3=challenging)
        const getDifficultyLevel = (diff) => {
            if (!diff) return undefined;
            console.log('getDifficultyLevel called with:', diff);
            switch (diff.toLowerCase()) {
                case 'easy': 
                    console.log('Converting "easy" to 1');
                    return 1;
                case 'moderate': 
                    console.log('Converting "moderate" to 2');
                    return 2;
                case 'challenging': 
                    console.log('Converting "challenging" to 3');
                    return 3;
                default: 
                    console.log('Unknown difficulty, returning undefined');
                    return undefined;
            }
        };

        const finalDifficultyLevel = getDifficultyLevel(tourDifficulty);
        
        console.log('=== DIFFICULTY CONVERSION DEBUG ===');
        console.log('Raw difficulty from body:', difficulty);
        console.log('Raw difficulty_level from body:', difficulty_level);
        console.log('tourDifficulty resolved to:', tourDifficulty);
        console.log('finalDifficultyLevel converted to:', finalDifficultyLevel);
        console.log('Type of finalDifficultyLevel:', typeof finalDifficultyLevel);

        const dataToUpdate = { 
            title: tourTitle,
            slug, 
            description, 
            short_description, 
            category_id, 
            // destination_id Prisma field'ı değil, destination relation'ı kullan
            ...(destination_id && { destination: { connect: { id: destination_id } } }),
            guide_id, 
            status: tourStatus, 
            duration_hours: tourDuration ? parseInt(tourDuration) : undefined,
            max_participants: tourMaxParticipants ? parseInt(tourMaxParticipants) : undefined,
            min_participants: min_participants ? parseInt(min_participants) : undefined,
            price_adult: tourPrice ? parseFloat(tourPrice) : undefined,
            price_child: price_child ? parseFloat(price_child) : undefined,
            price_currency, 
            difficulty_level: finalDifficultyLevel, 
            age_limit, 
            featured, 
            includes: tourIncludes, 
            excludes: tourExcludes, 
            benefits,
            itinerary,
            requirements, 
            cancellation_policy, 
            images: tourImages,
            departure_location,
            departure_time,
            return_time,
            deposit: deposit ? parseFloat(deposit) : undefined,
            metadata, 
            seo_title, 
            seo_description 
        };
        
        console.log('=== DATA TO UPDATE DEBUG ===');
        console.log('dataToUpdate object before cleanup:', JSON.stringify(dataToUpdate, null, 2));
        console.log('difficulty_level in dataToUpdate:', dataToUpdate.difficulty_level);
        console.log('Type of difficulty_level in dataToUpdate:', typeof dataToUpdate.difficulty_level);
        
        // Remove fields that don't exist in the schema and undefined values
        const fieldsToRemove = ['benefits', 'itinerary', 'images', 'tour_type', 'start_date', 'end_date', 'highlights', 'departure_location', 'departure_time', 'return_time', 'deposit', 'location'];
        fieldsToRemove.forEach(field => {
          if (dataToUpdate.hasOwnProperty(field)) {
            delete dataToUpdate[field];
          }
        });
        
        Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);

        console.log('=== DATA TO UPDATE AFTER CLEANUP ===');
        console.log('dataToUpdate after cleanup:', JSON.stringify(dataToUpdate, null, 2));
        console.log('difficulty_level after cleanup:', dataToUpdate.difficulty_level);

        console.log('=== ABOUT TO CALL PRISMA UPDATE ===');
        console.log('Calling prisma.tour.update with data:', JSON.stringify(dataToUpdate, null, 2));

        await prisma.tour.update({ where: { id }, data: dataToUpdate });

        const updatedTour = await prisma.tour.findUnique({
            where: { id },
            include: {
                destination: { select: { name: true } },
                _count: { select: { reservations: true } }
            }
        });

        // Frontend formatında döndür
        const getDifficultyString = (level) => {
            switch (level) {
                case 1: return 'easy';
                case 2: return 'moderate';
                case 3: return 'challenging';
                default: return null;
            }
        };

        const formattedTour = {
            id: updatedTour.id,
            name: updatedTour.title,
            title: updatedTour.title,
            description: updatedTour.description,
            price: updatedTour.price_adult,
            duration: updatedTour.duration_hours,
            max_group_size: updatedTour.max_participants,
            destination_id: updatedTour.destination_id,
            difficulty: getDifficultyString(updatedTour.difficulty_level),
            tour_type: updatedTour.tour_type,
            image_url: updatedTour.images ? (Array.isArray(updatedTour.images) ? updatedTour.images[0] : updatedTour.images) : "",
            start_date: updatedTour.start_date,
            end_date: updatedTour.end_date,
            highlights: updatedTour.includes || [],
            departure_location: updatedTour.departure_location,
            departure_time: updatedTour.departure_time,
            return_time: updatedTour.return_time,
            included: updatedTour.includes || [],
            excluded: updatedTour.excludes || [],
            benefits: updatedTour.benefits || [],
            itinerary: updatedTour.itinerary || [],
            is_active: updatedTour.status === 'active',
            deposit: updatedTour.deposit || 0,
            status: updatedTour.status,
            destination_name: updatedTour.destination ? updatedTour.destination.name : 'N/A',
            reservation_count: updatedTour._count.reservations
        };

        res.json(formattedTour);
    } catch (error) {
        console.error(`Error updating tour ${id}:`, error);
        res.status(500).json({ message: 'Error updating tour', error: error.message });
    }
});

router.get('/tours/:id/pricing-data', async (req, res) => {
    const { id } = req.params;
    try {
        const tourWithPricing = await prisma.tour.findUnique({
            where: { id },
            include: {
                pricingData: true,
                timeSlots: true,
                seasonalPricing: true,
                groupDiscounts: true,
            }
        });

        if (!tourWithPricing) {
            return res.status(404).json({ message: 'Tour pricing data not found' });
        }

        const response = {
            price_adult: tourWithPricing.price_adult,
            price_child: tourWithPricing.price_child,
            price_currency: tourWithPricing.price_currency,
            tourPricing: tourWithPricing.pricingData,
            timeSlots: tourWithPricing.timeSlots,
            seasonalPricing: tourWithPricing.seasonalPricing,
            groupDiscounts: tourWithPricing.groupDiscounts,
        };

        res.json(response);
    } catch (error) {
        console.error(`Error fetching tour pricing data for tour ${id}:`, error);
        res.status(500).json({ message: 'Error fetching tour pricing data' });
    }
});

router.put('/tours/:id/pricing-data', async (req, res) => {
    const { id } = req.params;
    const { 
        price_adult, 
        price_child, 
        price_currency, 
        tourPricing, 
        timeSlots, 
        seasonalPricing, 
        groupDiscounts 
    } = req.body;

    try {
        await prisma.$transaction(async (tx) => {
            // Update the basic pricing fields on the tour itself
            await tx.tour.update({
                where: { id },
                data: {
                    price_adult: price_adult ? parseFloat(price_adult) : undefined,
                    price_child: price_child ? parseFloat(price_child) : undefined,
                    price_currency: price_currency || undefined,
                },
            });

            // Handle tourPricing updates
            if (tourPricing && Array.isArray(tourPricing)) {
                await tx.tourPricing.deleteMany({ where: { tour_id: id } });
                if (tourPricing.length > 0) {
                    await tx.tourPricing.createMany({
                        data: tourPricing.map(pricing => ({
                            tour_id: id,
                            customer_type: pricing.customer_type,
                            base_price: parseFloat(pricing.base_price),
                            accommodation_type: pricing.accommodation_type,
                        })),
                    });
                }
            }

            // Handle timeSlots updates
            if (timeSlots && Array.isArray(timeSlots)) {
                await tx.timeSlot.deleteMany({ where: { tour_id: id } });
                if (timeSlots.length > 0) {
                    await tx.timeSlot.createMany({
                        data: timeSlots.map(slot => ({
                            tour_id: id,
                            start_time: slot.start_time,
                            end_time: slot.end_time,
                            max_capacity: parseInt(slot.max_capacity),
                        })),
                    });
                }
            }

            // Handle seasonalPricing updates
            if (seasonalPricing && Array.isArray(seasonalPricing)) {
                await tx.seasonalPricing.deleteMany({ where: { tour_id: id } });
                if (seasonalPricing.length > 0) {
                    await tx.seasonalPricing.createMany({
                        data: seasonalPricing.map(season => ({
                            tour_id: id,
                            customer_type: season.customer_type,
                            start_date: new Date(season.start_date),
                            end_date: new Date(season.end_date),
                            price_adjustment: parseFloat(season.price_adjustment),
                            adjustment_type: season.adjustment_type,
                        })),
                    });
                }
            }

            // Handle groupDiscounts updates
            if (groupDiscounts && Array.isArray(groupDiscounts)) {
                await tx.groupDiscount.deleteMany({ where: { tour_id: id } });
                if (groupDiscounts.length > 0) {
                    await tx.groupDiscount.createMany({
                        data: groupDiscounts.map(discount => ({
                            tour_id: id,
                            customer_type: discount.customer_type,
                            min_group_size: parseInt(discount.min_group_size),
                            max_group_size: discount.max_group_size ? parseInt(discount.max_group_size) : null,
                            discount_type: discount.discount_type,
                            discount_percentage: discount.discount_percentage ? parseFloat(discount.discount_percentage) : null,
                            discount_amount: discount.discount_amount ? parseFloat(discount.discount_amount) : null,
                            discount_reason: discount.discount_reason,
                        })),
                    });
                }
            }
        });

        res.json({ message: 'Tour pricing data updated successfully' });
    } catch (error) {
        console.error(`Error updating tour pricing data for tour ${id}:`, error);
        res.status(500).json({ message: 'Error updating tour pricing data', error: error.message });
    }
});

router.delete('/tours/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.$transaction(async (tx) => {
            // Delete related pricing data first
            await tx.tourPricing.deleteMany({ where: { tour_id: id } });
            await tx.timeSlot.deleteMany({ where: { tour_id: id } });
            await tx.seasonalPricing.deleteMany({ where: { tour_id: id } });
            await tx.groupDiscount.deleteMany({ where: { tour_id: id } });
            
            // Delete reviews
            await tx.review.deleteMany({ where: { tourId: id } });
            
            // Delete reservations and their payments
            const reservations = await tx.reservation.findMany({ where: { tourId: id }, select: { id: true } });
            const reservationIds = reservations.map(r => r.id);
            if (reservationIds.length > 0) {
                await tx.payment.deleteMany({ where: { reservationId: { in: reservationIds } } });
                await tx.reservation.deleteMany({ where: { id: { in: reservationIds } } });
            }
            
            // Finally delete the tour
            await tx.tour.delete({ where: { id } });
        });
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting tour ${id}:`, error);
        res.status(500).json({ message: 'Error deleting tour' });
    }
});

// --- DESTINATION MANAGEMENT --- //
router.get('/destinations', async (req, res) => {
    try {
        const destinations = await prisma.destination.findMany({
            include: {
                _count: { select: { tours: true } }
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(destinations);
    } catch (error) {
        console.error('Error fetching admin destinations:', error);
        res.status(500).json({ message: 'Error fetching admin destinations' });
    }
});

router.post('/destinations', async (req, res) => {
    try {
        console.log('POST /destinations - Request body:', JSON.stringify(req.body, null, 2));
        
        // Generate unique slug for destination
        const generateUniqueDestinationSlug = async (name) => {
            console.log('generateUniqueDestinationSlug called with name:', name);
            
            if (!name || typeof name !== 'string') {
                console.log('Invalid name provided, using fallback');
                name = 'destination';
            }
            
            const baseSlug = name.toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            
            console.log('Base slug generated:', baseSlug);
            
            let slug = baseSlug || 'destination';
            let counter = 1;
            
            while (true) {
                console.log('Checking slug availability:', slug);
                
                const existingDestination = await prisma.destination.findUnique({
                    where: { slug }
                });
                
                if (!existingDestination) {
                    console.log('Slug is available:', slug);
                    return slug;
                }
                
                console.log('Slug already exists, trying with counter:', counter);
                slug = `${baseSlug || 'destination'}-${counter}`;
                counter++;
                
                // Safety check to prevent infinite loop
                if (counter > 1000) {
                    console.log('Counter exceeded 1000, using timestamp');
                    return `${baseSlug || 'destination'}-${Date.now()}`;
                }
            }
        };
        
        // Ensure required fields exist
        if (!req.body.name) {
            return res.status(400).json({ message: 'Name is required for destination creation' });
        }
        
        const generatedSlug = await generateUniqueDestinationSlug(req.body.name);
        console.log('Final generated slug:', generatedSlug);
        
        // Handle country_id - use a default UUID if not provided
        let finalCountryId = req.body.country_id;
        
        if (!finalCountryId) {
            console.log('No country_id provided, using default country_id');
            // Use a default country ID (you can create a "Turkey" country record in DB with this ID)
            finalCountryId = '550e8400-e29b-41d4-a716-446655440001'; // Default UUID for Turkey
            console.log('Using default country_id:', finalCountryId);
        }
        
        const destinationData = {
            ...req.body,
            slug: req.body.slug || generatedSlug,
            country_id: finalCountryId
        };
        
        console.log('POST /destinations - Final data:', JSON.stringify(destinationData, null, 2));
        
        const newDestination = await prisma.destination.create({ data: destinationData });
        console.log('Destination created successfully:', newDestination.id);
        res.status(201).json(newDestination);
    } catch (error) {
        console.error('Error creating destination:', error);
        res.status(500).json({ message: 'Error creating destination', error: error.message });
    }
});

router.put('/destinations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedDestination = await prisma.destination.update({
            where: { id },
            data: req.body
        });
        res.json(updatedDestination);
    } catch (error) {
        console.error(`Error updating destination ${id}:`, error);
        res.status(500).json({ message: 'Error updating destination' });
    }
});

router.delete('/destinations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.destination.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting destination ${id}:`, error);
        res.status(500).json({ message: 'Error deleting destination' });
    }
});


// --- RESERVATION MANAGEMENT --- //
router.get('/reservations', async (req, res) => {
    try {
        const reservations = await prisma.reservation.findMany({
            include: {
                tour: { select: { title: true, destination: { select: { name: true } } } },
                user: { select: { first_name: true, last_name: true, email: true, phone: true } }
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching admin reservations:', error);
        res.status(500).json({ message: 'Error fetching admin reservations' });
    }
});

router.put('/reservations/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedReservation = await prisma.reservation.update({
            where: { id },
            data: { status }
        });
        res.json(updatedReservation);
    } catch (error) {
        console.error(`Error updating reservation status for ${id}:`, error);
        res.status(500).json({ message: 'Error updating reservation status' });
    }
});

// --- REVIEW MANAGEMENT --- //
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                tour: { select: { title: true } },
                user: { select: { first_name: true, last_name: true, email: true } }
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        res.status(500).json({ message: 'Error fetching admin reviews' });
    }
});

router.put('/reviews/bulk-update', async (req, res) => {
    const { reviewIds, is_verified } = req.body;

    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
        return res.status(400).json({ message: 'reviewIds must be a non-empty array' });
    }
    if (typeof is_verified !== 'boolean') {
        return res.status(400).json({ message: 'is_verified must be a boolean' });
    }

    try {
        const result = await prisma.review.updateMany({
            where: { id: { in: reviewIds } },
            data: { is_verified }
        });
        res.json({ count: result.count });
    } catch (error) {
        console.error('Error bulk updating reviews:', error);
        res.status(500).json({ message: 'Error updating reviews' });
    }
});

router.put('/reviews/:id/verify', async (req, res) => {
    const { id } = req.params;
    const { is_verified } = req.body;
    try {
        const updatedReview = await prisma.review.update({
            where: { id },
            data: { is_verified }
        });
        res.json(updatedReview);
    } catch (error) {
        console.error(`Error verifying review ${id}:`, error);
        res.status(500).json({ message: 'Error verifying review' });
    }
});

router.delete('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.review.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting review ${id}:`, error);
        res.status(500).json({ message: 'Error deleting review' });
    }
});


// --- PAGE MANAGEMENT --- //

const PAGE_STATUSES = ['draft', 'published', 'archived'];
const PAGE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const buildPageData = (body) => {
  const data = {};

  if (body.title !== undefined) data.title = String(body.title).trim();
  if (body.slug !== undefined) data.slug = String(body.slug).trim().replace(/^\/+|\/+$/g, '');
  if (body.content !== undefined) data.content = body.content;
  if (body.meta_title !== undefined) data.meta_title = body.meta_title ? String(body.meta_title) : null;
  if (body.meta_description !== undefined) data.meta_description = body.meta_description ? String(body.meta_description) : null;
  if (body.meta_keywords !== undefined) data.meta_keywords = body.meta_keywords;
  if (body.status !== undefined) data.status = String(body.status);
  if (body.template_type !== undefined) data.template_type = String(body.template_type);
  if (body.is_homepage !== undefined) data.is_homepage = body.is_homepage;

  return data;
};

const validatePageData = (data, { partial = false } = {}) => {
  if (!partial || data.title !== undefined) {
    if (!data.title) return 'Title is required.';
  }
  if (!partial || data.slug !== undefined) {
    if (!data.slug) return 'Slug is required.';
    if (!PAGE_SLUG_PATTERN.test(data.slug)) {
      return 'Slug may only contain lowercase letters, numbers, and single hyphens.';
    }
  }
  if (data.content !== undefined && (data.content === null || typeof data.content !== 'object')) {
    return 'Content must be a JSON array or object.';
  }
  if (data.meta_keywords !== undefined && (!Array.isArray(data.meta_keywords) || data.meta_keywords.some(k => typeof k !== 'string'))) {
    return 'meta_keywords must be an array of strings.';
  }
  if (data.status !== undefined && !PAGE_STATUSES.includes(data.status)) {
    return `Status must be one of: ${PAGE_STATUSES.join(', ')}.`;
  }
  if (data.is_homepage !== undefined && typeof data.is_homepage !== 'boolean') {
    return 'is_homepage must be a boolean.';
  }
  if (data.template_type !== undefined && !data.template_type) {
    return 'template_type cannot be empty.';
  }
  return null;
};

router.get('/pages', async (req, res) => {
  try {
    const pages = await prisma.page.findMany({ orderBy: { created_at: 'desc' } });
    res.json(pages);
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    res.status(500).json({ message: 'Failed to fetch pages' });
  }
});

router.get('/pages/:id', async (req, res) => {
  try {
    const page = await prisma.page.findUnique({ where: { id: req.params.id } });
    if (!page) {
      return res.status(404).json({ message: 'Page not found.' });
    }
    res.json(page);
  } catch (error) {
    console.error('Failed to fetch page:', error);
    res.status(500).json({ message: 'Failed to fetch page' });
  }
});

router.post('/pages', async (req, res) => {
  const data = buildPageData(req.body);
  const validationError = validatePageData(data);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existing = await prisma.page.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return res.status(409).json({ message: 'A page with this slug already exists.' });
    }

    const page = await prisma.page.create({ data });
    res.status(201).json(page);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A page with this slug already exists.' });
    }
    console.error('Failed to create page:', error);
    res.status(500).json({ message: 'Failed to create page' });
  }
});

router.put('/pages/:id', async (req, res) => {
  const data = buildPageData(req.body);
  const validationError = validatePageData(data, { partial: true });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: 'No updatable fields provided.' });
  }

  try {
    const page = await prisma.page.findUnique({ where: { id: req.params.id } });
    if (!page) {
      return res.status(404).json({ message: 'Page not found.' });
    }

    if (data.slug && data.slug !== page.slug) {
      const existing = await prisma.page.findUnique({ where: { slug: data.slug } });
      if (existing) {
        return res.status(409).json({ message: 'A page with this slug already exists.' });
      }
    }

    const updatedPage = await prisma.page.update({ where: { id: page.id }, data });
    res.json(updatedPage);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A page with this slug already exists.' });
    }
    console.error('Failed to update page:', error);
    res.status(500).json({ message: 'Failed to update page' });
  }
});

router.delete('/pages/:id', async (req, res) => {
  try {
    await prisma.page.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Page not found.' });
    }
    console.error('Failed to delete page:', error);
    res.status(500).json({ message: 'Failed to delete page' });
  }
});

// --- USER MANAGEMENT --- //
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        reservations: {
          select: {
            id: true,
            totalPrice: true,
          }
        },
        reviews: {
          select: {
            id: true,
          }
        },
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      email_verified: user.email_verified,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      role: user.role,
      total_spent: user.reservations.reduce((acc, r) => acc + (r.totalPrice || 0), 0),
      reservation_count: user.reservations.length,
      review_count: user.reviews.length,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

router.put('/users/:id/role', adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { roleName } = req.body; // e.g., 'admin', 'guide'

    if (!roleName) {
        return res.status(400).json({ message: 'Role name is required' });
    }

    try {
        const assignableRoles = ['user', 'guide', 'admin'];
        if (!assignableRoles.includes(roleName)) {
            return res.status(400).json({ message: `Invalid role: ${roleName}` });
        }

        await prisma.user.update({
            where: { id },
            data: { role: roleName },
        });

        res.json({ message: `User role updated to ${roleName}` });
    } catch (error) {
        console.error(`Error updating user role for ${id}:`, error);
        res.status(500).json({ message: 'Error updating user role' });
    }
});


// --- SITE SETTINGS --- //
router.get('/site-settings', adminMiddleware, async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      // If no settings exist, create a default entry
      const defaultSettings = await prisma.siteSettings.create({
        data: {
          key: 'default', // Add a default key to satisfy schema requirements
          value: {
            site_title: 'NextStopTurkey',
            site_tagline: 'Your adventure starts here',
            company_name: 'NextStopTurkey LLC',
            website_url: 'https://nextstopturkey.com',
            contact_email: 'info@nextstopturkey.com',
            support_email: 'support@nextstopturkey.com',
            contact_phone: '+90 555 555 5555',
            address: '123 Tour St, Istanbul, Turkey',
            primary_color: '#FF5722',
            secondary_color: '#2A3F54',
            copyright_text: `© ${new Date().getFullYear()} NextStopTurkey. All Rights Reserved.`,
            default_meta_description: 'Explore the best tours and travel packages in Turkey with NextStopTurkey.',
            default_meta_keywords: 'turkey, travel, tours, istanbul, cappadocia',
            google_analytics_id: 'UA-XXXXX-Y',
            google_tag_manager_id: 'GTM-XXXX',
            social_media_links: {
              facebook: 'https://facebook.com/nextstopturkey',
              twitter: 'https://twitter.com/nextstopturkey',
              instagram: 'https://instagram.com/nextstopturkey',
              linkedin: '',
              youtube: ''
            }
          }
        },
      });
      return res.json(defaultSettings);
    }
    res.json(settings);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    res.status(500).json({ message: 'Failed to fetch site settings', error: error.message });
  }
});

router.put('/site-settings', adminMiddleware, async (req, res) => {
  const settingsData = req.body;
  try {
    const currentSettings = await prisma.siteSettings.findFirst();
    if (!currentSettings) {
        return res.status(404).json({ message: 'Site settings not found. Cannot update.' });
    }
    
    const updatedSettings = await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: { value: settingsData },
    });
    res.json(updatedSettings);
  } catch (error) {
    console.error('Failed to update site settings:', error);
    res.status(500).json({ message: 'Failed to update site settings', error: error.message });
  }
});

// --- EMAIL SUBSCRIPTIONS --- //
router.get('/email-subscriptions', async (req, res) => {
  try {
    const subscriptions = await prisma.emailSubscription.findMany({
      orderBy: { consent_given_at: 'desc' },
      take: 500,
    });
    res.json(subscriptions);
  } catch (error) {
    console.error('Failed to list email subscriptions:', error);
    res.status(500).json({ message: 'Failed to retrieve email subscriptions.' });
  }
});

const CONTACT_MESSAGE_STATUSES = ['new', 'read', 'replied', 'archived'];

router.get('/contact-messages', async (req, res) => {
  const { status } = req.query;

  if (status && !CONTACT_MESSAGE_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid message status.' });
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      where: status ? { status } : undefined,
      orderBy: { created_at: 'desc' },
      take: 500,
    });
    res.json(messages);
  } catch (error) {
    console.error('Failed to list contact messages:', error);
    res.status(500).json({ message: 'Failed to retrieve contact messages.' });
  }
});

router.patch('/contact-messages/:id', async (req, res) => {
  const { status } = req.body ?? {};

  if (!CONTACT_MESSAGE_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid message status.' });
  }

  try {
    const existing = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    console.error('Failed to update contact message:', error);
    res.status(500).json({ message: 'Failed to update contact message.' });
  }
});


export default router;