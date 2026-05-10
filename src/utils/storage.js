// Storage Utility for managing localStorage

const STORAGE_KEY_TRIPS = 'traveloop_trips';
const STORAGE_KEY_USER = 'traveloop_user';

export const storageUtils = {
  // Trips management
  getAllTrips: () => {
    const trips = localStorage.getItem(STORAGE_KEY_TRIPS);
    return trips ? JSON.parse(trips) : [];
  },

  getTripById: (tripId) => {
    const trips = storageUtils.getAllTrips();
    return trips.find(trip => trip.id === tripId);
  },

  addTrip: (trip) => {
    const trips = storageUtils.getAllTrips();
    const newTrip = {
      ...trip,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      itinerary: [],
      budget: {
        transport: 0,
        stay: 0,
        food: 0,
        activity: 0
      }
    };
    trips.push(newTrip);
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
    return newTrip;
  },

  updateTrip: (tripId, updatedTrip) => {
    const trips = storageUtils.getAllTrips();
    const index = trips.findIndex(trip => trip.id === tripId);
    if (index !== -1) {
      trips[index] = { ...trips[index], ...updatedTrip };
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
      return trips[index];
    }
    return null;
  },

  deleteTrip: (tripId) => {
    const trips = storageUtils.getAllTrips();
    const filtered = trips.filter(trip => trip.id !== tripId);
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(filtered));
  },

  // Itinerary management
  getItinerary: (tripId) => {
    const trip = storageUtils.getTripById(tripId);
    return trip ? trip.itinerary : [];
  },

  addDay: (tripId) => {
    const trip = storageUtils.getTripById(tripId);
    if (trip) {
      const newDay = {
        id: Date.now().toString(),
        dayNumber: trip.itinerary.length + 1,
        activities: []
      };
      trip.itinerary.push(newDay);
      storageUtils.updateTrip(tripId, trip);
      return newDay;
    }
    return null;
  },

  addActivity: (tripId, dayId, activity) => {
    const trip = storageUtils.getTripById(tripId);
    if (trip) {
      const day = trip.itinerary.find(d => d.id === dayId);
      if (day) {
        const newActivity = {
          ...activity,
          id: Date.now().toString()
        };
        day.activities.push(newActivity);
        storageUtils.updateTrip(tripId, trip);
        return newActivity;
      }
    }
    return null;
  },

  deleteActivity: (tripId, dayId, activityId) => {
    const trip = storageUtils.getTripById(tripId);
    if (trip) {
      const day = trip.itinerary.find(d => d.id === dayId);
      if (day) {
        day.activities = day.activities.filter(a => a.id !== activityId);
        storageUtils.updateTrip(tripId, trip);
        return true;
      }
    }
    return false;
  },

  deleteDay: (tripId, dayId) => {
    const trip = storageUtils.getTripById(tripId);
    if (trip) {
      trip.itinerary = trip.itinerary.filter(d => d.id !== dayId);
      storageUtils.updateTrip(tripId, trip);
      return true;
    }
    return false;
  },

  // Budget management
  updateBudget: (tripId, budget) => {
    const trip = storageUtils.getTripById(tripId);
    if (trip) {
      trip.budget = budget;
      storageUtils.updateTrip(tripId, trip);
      return trip;
    }
    return null;
  },

  getBudget: (tripId) => {
    const trip = storageUtils.getTripById(tripId);
    return trip ? trip.budget : { transport: 0, stay: 0, food: 0, activity: 0 };
  },

  calculateTotalBudget: (tripId) => {
    const budget = storageUtils.getBudget(tripId);
    return (
      parseFloat(budget.transport || 0) +
      parseFloat(budget.stay || 0) +
      parseFloat(budget.food || 0) +
      parseFloat(budget.activity || 0)
    );
  },

  // User management (Simple login simulation)
  setUser: (user) => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEY_USER);
    return user ? JSON.parse(user) : null;
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
};
