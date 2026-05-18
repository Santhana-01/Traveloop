import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripApi, destinationApi, activityApi } from '../../api/client';
import MagneticEffect from '../../components/common/MagneticEffect';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/Itinerary.css';

function ItineraryBuilder() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadTrip = useCallback(async () => {
    try {
      const response = await tripApi.getTripById(tripId);
      if (response.success) setTrip(response.trip);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [tripId]);

  useEffect(() => { loadTrip(); }, [loadTrip]);

  if (loading) return <div className="fluid-loader">Mapping your journey...</div>;

  return (
    <div className="itinerary-immersive">
      <div className="itinerary-hero float-slow">
        <MagneticEffect strength={5}>
          <h1>{trip?.name}</h1>
        </MagneticEffect>
        <p>{new Date(trip?.startDate).toLocaleDateString()} — {new Date(trip?.endDate).toLocaleDateString()}</p>
      </div>

      <div className="itinerary-timeline">
        {trip?.destinations?.length === 0 ? (
          <div className="empty-itinerary">
            <p>No stops planned yet.</p>
            <button className="btn-primary-fluid" onClick={() => navigate(`/create-trip`, { state: { tripId } })}>+ Add a Stop</button>
          </div>
        ) : (
          <div className="stops-list">
            {trip?.destinations?.map((stop, i) => (
              <motion.div 
                key={stop._id} 
                className="stop-card-fluid"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="stop-marker">
                  <div className="marker-dot"></div>
                  {i < trip.destinations.length - 1 && <div className="marker-line"></div>}
                </div>
                <div className="stop-content">
                  <div className="stop-header">
                    <MagneticEffect strength={5}>
                      <h3>{stop.name}</h3>
                    </MagneticEffect>
                    <span className="stop-dates">{new Date(stop.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="activities-fluid-grid">
                    {stop.activities?.map(act => (
                      <MagneticEffect key={act._id} strength={3} range={50}>
                        <div className="activity-mini-card">
                          <span>{act.name}</span>
                        </div>
                      </MagneticEffect>
                    ))}
                    <MagneticEffect strength={3}>
                      <button className="btn-add-mini">+ Activity</button>
                    </MagneticEffect>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .itinerary-immersive { padding: 4rem 2rem; max-width: 1000px; margin: 0 auto; }
        .itinerary-hero { text-align: center; margin-bottom: 6rem; }
        .itinerary-hero h1 { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 1rem; }
        .itinerary-hero p { color: rgba(255, 255, 255, 0.4); font-size: 1.2rem; }
        .stops-list { display: flex; flex-direction: column; gap: 0; }
        .stop-card-fluid { display: flex; gap: 3rem; min-height: 200px; }
        .stop-marker { display: flex; flex-direction: column; align-items: center; width: 20px; }
        .marker-dot { width: 16px; height: 16px; background: #47B5FF; border-radius: 50%; box-shadow: 0 0 20px rgba(71, 181, 255, 0.5); }
        .marker-line { flex-grow: 1; width: 2px; background: rgba(255, 255, 255, 0.05); margin: 10px 0; }
        .stop-content { flex-grow: 1; padding-bottom: 4rem; }
        .stop-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .stop-header h3 { font-size: 1.8rem; font-weight: 800; }
        .stop-dates { color: rgba(255, 255, 255, 0.3); font-weight: 700; font-size: 0.9rem; }
        .activities-fluid-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
        .activity-mini-card { background: rgba(255, 255, 255, 0.03); padding: 0.8rem 1.5rem; border-radius: 12px; font-size: 0.9rem; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.05); }
        .btn-add-mini { background: none; border: 1px dashed rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.4); padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s ease; }
        .btn-add-mini:hover { border-color: #47B5FF; color: #47B5FF; }
      `}</style>
    </div>
  );
}

export default ItineraryBuilder;
