// Email validation and anti-spam utilities

export interface EmailValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100, higher is better
}

export interface ContentAnalysisResult {
  spamScore: number;
  spamWords: string[];
  recommendations: string[];
  isClean: boolean;
}

// Disposable email providers list (commonly used temporary email services)
const DISPOSABLE_EMAIL_PROVIDERS = [
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org', 'yopmail.com', 'dispostable.com',
  'tmpmail.org', 'maildrop.cc', 'sharklasers.com', 'guerrillamailblock.com',
  'pokemail.net', 'spam4.me', 'boun.cr', 'trbvm.com'
];

// Role-based email keywords that might indicate generic/admin emails
const ROLE_BASED_KEYWORDS = [
  'admin', 'administrator', 'info', 'support', 'help', 'contact',
  'sales', 'marketing', 'noreply', 'no-reply', 'webmaster',
  'postmaster', 'hostmaster', 'mail', 'email'
];

// Common spam words and phrases
const SPAM_WORDS = [
  // Financial/Money
  'free', 'urgent', 'limited time', 'act now', 'click here', 'guaranteed',
  'money back', 'no obligation', 'risk free', 'cash', 'prize', 'winner',
  'congratulations', 'bonus', 'discount', 'save money', 'cheap', 'deal',
  
  // Urgency/Pressure
  'urgent', 'immediate', 'expires today', 'limited offer', 'hurry',
  'only today', 'dont delay', 'act fast', 'last chance', 'final notice',
  
  // Suspicious phrases
  'make money', 'work from home', 'get rich', 'easy money', 'no experience',
  'no investment', 'double your income', 'financial freedom', 'debt free',
  
  // Medical/Adult
  'viagra', 'cialis', 'prescription', 'pharmacy', 'pills', 'medication',
  'adult', 'xxx', 'dating', 'singles', 'meet women', 'meet men',
  
  // Generic spam
  'spam', 'bulk', 'mass mail', 'newsletter', 'unsubscribe', 'opt out',
  'remove me', 'click below', 'visit our website', 'call now'
];

export class EmailValidator {
  /**
   * Comprehensive email validation
   */
  static async validateEmail(email: string): Promise<EmailValidationResult> {
    const result: EmailValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      score: 100
    };

    // Basic format validation
    if (!this.isValidFormat(email)) {
      result.isValid = false;
      result.errors.push('Invalid email format');
      result.score -= 50;
    }

    // Check for disposable email
    if (await this.isDisposableEmail(email)) {
      result.warnings.push('Disposable email provider detected');
      result.score -= 30;
    }

    // Check for role-based email
    if (this.isRoleBasedEmail(email)) {
      result.warnings.push('Role-based email detected (e.g., admin, info)');
      result.score -= 20;
    }

    // Domain validation
    const domainCheck = await this.validateDomain(email);
    if (!domainCheck.isValid) {
      result.errors.push(...domainCheck.errors);
      result.score -= 40;
    }

    // Final validation check
    if (result.errors.length > 0) {
      result.isValid = false;
    }

    return result;
  }

  /**
   * Basic email format validation using regex
   */
  static isValidFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if email is from a disposable email provider
   */
  static async isDisposableEmail(email: string): Promise<boolean> {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;

    return DISPOSABLE_EMAIL_PROVIDERS.includes(domain);
  }

  /**
   * Check if email is role-based (admin, info, etc.)
   */
  static isRoleBasedEmail(email: string): boolean {
    const localPart = email.split('@')[0]?.toLowerCase();
    if (!localPart) return false;

    return ROLE_BASED_KEYWORDS.some(keyword => 
      localPart.includes(keyword)
    );
  }

  /**
   * Validate email domain (basic MX record check would be done server-side)
   */
  static async validateDomain(email: string): Promise<{isValid: boolean, errors: string[]}> {
    const domain = email.split('@')[1];
    const errors: string[] = [];

    if (!domain) {
      errors.push('Invalid domain');
      return { isValid: false, errors };
    }

    // Basic domain format check
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      errors.push('Invalid domain format');
      return { isValid: false, errors };
    }

    // Note: MX record validation would be done server-side
    return { isValid: true, errors: [] };
  }
}

export class ContentAnalyzer {
  /**
   * Analyze email content for spam indicators
   */
  static analyzeContent(subject: string, body: string): ContentAnalysisResult {
    const allText = (subject + ' ' + body).toLowerCase();
    let spamScore = 0;
    const foundSpamWords: string[] = [];
    const recommendations: string[] = [];

    // Check for spam words
    SPAM_WORDS.forEach(word => {
      const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'gi');
      const matches = allText.match(regex);
      if (matches) {
        foundSpamWords.push(word);
        spamScore += matches.length * 10; // Each occurrence adds 10 points
      }
    });

    // Check text/HTML ratio (if HTML content is provided)
    const htmlTagRegex = /<[^>]*>/g;
    const hasHtml = htmlTagRegex.test(body);
    if (hasHtml) {
      const textContent = body.replace(htmlTagRegex, '').trim();
      const htmlContent = body.match(htmlTagRegex)?.join('') || '';
      
      if (htmlContent.length > textContent.length * 2) {
        spamScore += 20;
        recommendations.push('Reduce HTML/image ratio - too much HTML compared to text');
      }
    }

    // Check for excessive capitalization
    const capsWords = allText.match(/\b[A-Z]{3,}\b/g);
    if (capsWords && capsWords.length > 3) {
      spamScore += capsWords.length * 5;
      recommendations.push('Reduce excessive capitalization');
    }

    // Check for excessive exclamation marks
    const exclamationCount = (allText.match(/!/g) || []).length;
    if (exclamationCount > 3) {
      spamScore += exclamationCount * 3;
      recommendations.push('Reduce excessive exclamation marks');
    }

    // Check for suspicious URLs
    const urlRegex = /https?:\/\/[^\s]+/gi;
    const urls = allText.match(urlRegex) || [];
    if (urls.length > 5) {
      spamScore += (urls.length - 5) * 5;
      recommendations.push('Reduce number of links in email');
    }

    // Provide recommendations based on spam score
    if (spamScore > 50) {
      recommendations.push('High spam score - review content thoroughly');
    } else if (spamScore > 25) {
      recommendations.push('Moderate spam risk - consider content adjustments');
    }

    if (foundSpamWords.length > 0) {
      recommendations.push(`Avoid spam words: ${foundSpamWords.slice(0, 5).join(', ')}`);
    }

    return {
      spamScore,
      spamWords: foundSpamWords,
      recommendations,
      isClean: spamScore < 25 && foundSpamWords.length < 3
    };
  }

  /**
   * Generate content optimization suggestions
   */
  static generateOptimizationSuggestions(subject: string, body: string): string[] {
    const suggestions: string[] = [];

    // Subject line checks
    if (subject.length < 10) {
      suggestions.push('Subject line is too short - aim for 10-50 characters');
    } else if (subject.length > 50) {
      suggestions.push('Subject line is too long - keep under 50 characters');
    }

    // Personalization check
    if (!body.includes('{name}') && !body.includes('{{name}}')) {
      suggestions.push('Consider adding personalization (recipient name)');
    }

    // Call-to-action check
    const ctaWords = ['click', 'download', 'buy', 'purchase', 'subscribe', 'register'];
    const hasCta = ctaWords.some(word => body.toLowerCase().includes(word));
    if (!hasCta) {
      suggestions.push('Consider adding a clear call-to-action');
    }

    // Unsubscribe link check
    if (!body.toLowerCase().includes('unsubscribe')) {
      suggestions.push('Include an unsubscribe link for compliance');
    }

    return suggestions;
  }
}

export class ListManager {
  /**
   * Clean and validate email list
   */
  static async cleanEmailList(emails: string[]): Promise<{
    valid: string[];
    invalid: string[];
    warnings: Array<{email: string, issues: string[]}>;
  }> {
    const valid: string[] = [];
    const invalid: string[] = [];
    const warnings: Array<{email: string, issues: string[]}> = [];

    for (const email of emails) {
      const validation = await EmailValidator.validateEmail(email.trim());
      
      if (validation.isValid) {
        valid.push(email);
        if (validation.warnings.length > 0) {
          warnings.push({
            email,
            issues: validation.warnings
          });
        }
      } else {
        invalid.push(email);
      }
    }

    return { valid, invalid, warnings };
  }

  /**
   * Remove duplicates from email list
   */
  static removeDuplicates(emails: string[]): string[] {
    return [...new Set(emails.map(email => email.toLowerCase().trim()))];
  }

  /**
   * Segment emails based on domain
   */
  static segmentByDomain(emails: string[]): Record<string, string[]> {
    const segments: Record<string, string[]> = {};

    emails.forEach(email => {
      const domain = email.split('@')[1]?.toLowerCase();
      if (domain) {
        if (!segments[domain]) {
          segments[domain] = [];
        }
        segments[domain].push(email);
      }
    });

    return segments;
  }
}

export class DeliverabilityOptimizer {
  /**
   * Generate sender reputation recommendations
   */
  static generateReputationRecommendations(stats: {
    deliveredCount: number;
    bouncedCount: number;
    complainedCount: number;
    openedCount: number;
    clickedCount: number;
  }): string[] {
    const recommendations: string[] = [];
    const totalSent = stats.deliveredCount + stats.bouncedCount;
    
    if (totalSent === 0) return recommendations;

    // Bounce rate check
    const bounceRate = stats.bouncedCount / totalSent;
    if (bounceRate > 0.05) {
      recommendations.push(`High bounce rate (${(bounceRate * 100).toFixed(1)}%) - clean your email list`);
    }

    // Complaint rate check  
    const complaintRate = stats.complainedCount / stats.deliveredCount;
    if (complaintRate > 0.001) {
      recommendations.push(`High complaint rate (${(complaintRate * 100).toFixed(3)}%) - review content and targeting`);
    }

    // Engagement rate check
    const openRate = stats.openedCount / stats.deliveredCount;
    if (openRate < 0.15) {
      recommendations.push(`Low open rate (${(openRate * 100).toFixed(1)}%) - improve subject lines`);
    }

    const clickRate = stats.clickedCount / stats.deliveredCount;
    if (clickRate < 0.02) {
      recommendations.push(`Low click rate (${(clickRate * 100).toFixed(1)}%) - improve content and CTAs`);
    }

    return recommendations;
  }

  /**
   * Calculate sender reputation score
   */
  static calculateReputationScore(stats: {
    deliveredCount: number;
    bouncedCount: number;
    complainedCount: number;
    openedCount: number;
    clickedCount: number;
  }): number {
    const totalSent = stats.deliveredCount + stats.bouncedCount;
    if (totalSent === 0) return 0;

    const deliveryRate = stats.deliveredCount / totalSent;
    const bounceRate = stats.bouncedCount / totalSent;
    const complaintRate = stats.complainedCount / Math.max(stats.deliveredCount, 1);
    const engagementRate = (stats.openedCount + stats.clickedCount) / Math.max(stats.deliveredCount, 1);

    // Calculate score (0-100)
    let score = 100;
    score -= bounceRate * 200; // Penalize bounces heavily
    score -= complaintRate * 1000; // Penalize complaints very heavily
    score += engagementRate * 50; // Reward engagement
    score *= deliveryRate; // Scale by delivery rate

    return Math.max(0, Math.min(100, score));
  }
}
