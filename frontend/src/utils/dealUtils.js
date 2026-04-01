/**
 * Utility to manage and clean up deals based on expiry dates
 */

export const cleanupExpiredDeals = () => {
    try {
        const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today

        const validDeals = storedDeals.filter(deal => {
            if (!deal.expiryDate) return true; // Keep deals without expiry date (optional)
            
            const expiry = new Date(deal.expiryDate);
            expiry.setHours(23, 59, 59, 999); // End of the expiry day

            // Return true if expiry is in future or today
            return expiry >= now;
        });

        if (validDeals.length !== storedDeals.length) {
            localStorage.setItem('hodama_all_deals_v1', JSON.stringify(validDeals));
            console.log(`Cleaned up ${storedDeals.length - validDeals.length} expired deal(s).`);
            return true; // Changes made
        }
    } catch (error) {
        console.error("Error cleaning up deals:", error);
    }
    return false;
};

export const isDealExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(23, 59, 59, 999);
    return expiry < now;
};
