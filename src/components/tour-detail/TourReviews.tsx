
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import ReviewsList from "@/components/reviews/ReviewsList";
import ReviewForm from "@/components/reviews/ReviewForm";

interface TourReviewsProps {
  tourId: string;
}

export default function TourReviews({ tourId }: TourReviewsProps) {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{t.tourDetail.reviews}</h2>
      <ReviewsList tourId={tourId} />
      
      {user && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">{t.reviews.writeReview}</h3>
          <ReviewForm 
            tourId={tourId} 
            onSuccess={() => window.location.reload()} 
          />
        </div>
      )}
    </section>
  );
}
