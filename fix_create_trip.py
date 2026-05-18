import re

# Read the file
with open('src/pages/CreateTrip.js', 'r') as f:
    content = f.read()

# Fix 1: Update budget placeholder
content = content.replace('placeholder="e.number"', 'placeholder="Enter your total budget"')

# Fix 2: Update budget input to allow empty value and add step
old_budget = '''              <div className="form-group">
                <label>Estimated Budget (₹) *</label>
                <input
                  type="number"
                  name="budget"
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter your total budget"
                />
              </div>'''

new_budget = '''              <div className="form-group">
                <label>Estimated Budget (₹) *</label>
                <input
                  type="number"
                  name="budget"
                  min="0"
                  step="0.01"
                  value={formData.budget || ''}
                  onChange={handleChange}
                  placeholder="Enter your total budget"
                />
              </div>'''

content = content.replace(old_budget, new_budget)

# Fix 3: Update checkbox structure
old_checkbox = '''            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                />{' '}
                Make this trip public (visible to others)
              </label>
            </div>'''

new_checkbox = '''            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
              <label htmlFor="isPublic">
                Make this trip public (visible to others)
              </label>
            </div>'''

content = content.replace(old_checkbox, new_checkbox)

# Fix 4: Simplify handleAddItinerary to just navigate
old_itinerary = '''  const handleAddItinerary = async () => {
    try {
      setLoading(true);
      setError('');
      // Auto-create days based on dates
      const dayPromises = [];
      for (let i = 1; i <= totalDays; i++) {
        dayPromises.push(destinationApi.addDestination(createdTripId, { 
          name: `Day ${i}`,
          country: formData.tripName,
          startDate: formData.startDate,
          endDate: formData.endDate
        }));
      }
      await Promise.all(dayPromises);
      navigate(`/trip/${createdTripId}`);
    } catch (err) {
      console.log('Add itinerary error:', err.message);
      // Still navigate - days can be added manually
      setError('Trip created! Itinerary auto-plan unavailable, but you can add days manually.');
      setTimeout(() => {
        navigate(`/trip/${createdTripId}`);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };'''

new_itinerary = '''  const handleAddItinerary = () => {
    // Navigate directly to trip itinerary page where user can add days/activities
    navigate(`/trip/${createdTripId}`);
  };'''

content = content.replace(old_itinerary, new_itinerary)

# Write back
with open('src/pages/CreateTrip.js', 'w') as f:
    f.write(content)

print('CreateTrip.js fixed successfully!')
