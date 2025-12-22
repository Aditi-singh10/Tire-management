/**
 * Tire Lifecycle Calculator
 *
 * Centralized utility to calculate tire usage, wear percentage,
 * and remaining lifecycle based on trips and distance.
 */

/**
 * Calculates total distance covered by a tire.
 * @param {Array} trips - Array of trip objects containing distance
 * @returns {number}
 */
function calculateTotalDistance(trips = []) {
  if (!Array.isArray(trips)) return 0;

  return trips.reduce((total, trip) => {
    const distance = Number(trip?.distance || 0);
    return total + distance;
  }, 0);
}

/**
 * Calculates tire wear percentage.
 * @param {number} usedDistance
 * @param {number} maxLifecycleDistance
 * @returns {number}
 */
function calculateWearPercentage(usedDistance, maxLifecycleDistance) {
  if (!maxLifecycleDistance || maxLifecycleDistance <= 0) return 0;

  const wear = (usedDistance / maxLifecycleDistance) * 100;
  return Math.min(Math.round(wear * 100) / 100, 100);
}

/**
 * Calculates remaining distance for a tire.
 * @param {number} usedDistance
 * @param {number} maxLifecycleDistance
 * @returns {number}
 */
function calculateRemainingDistance(usedDistance, maxLifecycleDistance) {
  if (!maxLifecycleDistance || maxLifecycleDistance <= 0) return 0;

  const remaining = maxLifecycleDistance - usedDistance;
  return Math.max(remaining, 0);
}

/**
 * Determines tire health status based on wear percentage.
 * @param {number} wearPercentage
 * @returns {string}
 */
function getTireHealthStatus(wearPercentage) {
  if (wearPercentage >= 100) return "EXPIRED";
  if (wearPercentage >= 80) return "CRITICAL";
  if (wearPercentage >= 50) return "WARNING";
  return "HEALTHY";
}

/**
 * Main lifecycle calculator
 * @param {Object} params
 * @param {Array} params.trips - Trips where the tire was used
 * @param {number} params.maxLifecycleDistance - Maximum allowed distance
 * @returns {Object}
 */
function calculateTireLifecycle({ trips = [], maxLifecycleDistance }) {
  const totalDistance = calculateTotalDistance(trips);
  const wearPercentage = calculateWearPercentage(
    totalDistance,
    maxLifecycleDistance
  );
  const remainingDistance = calculateRemainingDistance(
    totalDistance,
    maxLifecycleDistance
  );
  const status = getTireHealthStatus(wearPercentage);

  return {
    totalDistanceUsed: totalDistance,
    remainingDistance,
    wearPercentage,
    status,
  };
}

module.exports = {
  calculateTotalDistance,
  calculateWearPercentage,
  calculateRemainingDistance,
  getTireHealthStatus,
  calculateTireLifecycle,
};
