# 🔧 Troubleshooting Guide - NSS Care Network Portal

## ✅ Common Issues & Solutions

---

## 🟢 Quick Fix Checklist

Before diving into specific issues, try these:

- [ ] Hard refresh the page (Ctrl+Shift+R)
- [ ] Clear browser cache
- [ ] Check internet connection
- [ ] Look at browser console for errors (F12)
- [ ] Click "Initialize Sample Data" button if you haven't

---

## 🟡 Issue: "Initialize Sample Data" button not working

### Symptoms
- Click button, nothing happens
- No success notification
- Button doesn't disappear

### Solutions

**1. Check Internet Connection**
The button makes an API call to Supabase Edge Functions. Ensure you're online.

**2. Check Browser Console**
- Press F12 to open DevTools
- Go to Console tab
- Look for error messages
- Share the error for specific help

**3. Clear LocalStorage**
```javascript
// Open browser console and run:
localStorage.clear();
// Then refresh page and try again
```

**4. Try Again**
Sometimes API calls timeout. Just click the button again.

---

## 🟡 Issue: No data showing in app

### Check List
- [ ] Did you click "Initialize Sample Data"?
- [ ] Did you see the success notification?
- [ ] Did you refresh the page after initialization?
- [ ] Check browser console for errors

### Solutions

**1. Re-initialize Data**
```javascript
// Open browser console
localStorage.removeItem('nss-data-initialized');
// Refresh page
// Click Initialize button again
```

**2. Check localStorage Data**
Open browser console and test:
```javascript
const data = JSON.parse(localStorage.getItem('nss-care-network-data'));
console.log('All data:', data);
console.log('Donors:', data.donors);
console.log('Camps:', data.camps);
```
Should show your data objects

**3. Verify Initialization**
```javascript
console.log('Initialized:', localStorage.getItem('nss-data-initialized'));
```
Should show `"true"` if initialized

---

## 🟡 Issue: Forms not submitting

### Symptoms
- Click submit, nothing happens
- Form stays open
- No error message

### Solutions

**1. Check Console Errors**
- Open DevTools (F12)
- Look for red error messages
- Share error for specific help

**2. Check Network Tab**
- Open DevTools → Network tab
- Submit form again
- Look for failed requests (red)
- Click on failed request to see details

**3. Verify localStorage Working**
Test data storage directly:
```javascript
// Test adding data
const data = JSON.parse(localStorage.getItem('nss-care-network-data'));
data.helpRequests.push({
  id: 'test-123',
  name: 'Test',
  location: 'Test Location',
  status: 'pending'
});
localStorage.setItem('nss-care-network-data', JSON.stringify(data));
console.log('Test data added!');
// Refresh page to see it
```

---

## 🟡 Issue: Can't see all donors/camps/missions

### Check Filters
1. Look for filter dropdowns/inputs
2. Reset all filters to "All" or empty
3. Click search/submit
4. Data should appear

### Check Data Exists
```javascript
// Check all data counts
const data = JSON.parse(localStorage.getItem('nss-care-network-data'));
console.log('Donors:', data.donors.length);
console.log('Camps:', data.camps.length);
console.log('Missions:', data.reliefMissions.length);
console.log('Help Requests:', data.helpRequests.length);
```

---

## 🟡 Issue: "Failed to fetch" errors

### This Shouldn't Happen
The app uses localStorage, not network requests. If you see this:

### Solutions

**1. Check What Failed**
Open Network tab (F12 → Network), look for failed requests. This might be:
- Unsplash images loading
- External resources
- NOT your data (that's in localStorage)

**2. Data Still Works**
Even if network fails, your data is safe in localStorage:
```javascript
// Check your data
console.log(JSON.parse(localStorage.getItem('nss-care-network-data')));
```

**3. Ignore Image Errors**
Images from Unsplash may fail - this won't affect functionality.

---

## 🟡 Issue: Data disappears after refresh

### This Shouldn't Happen
Data is stored in KV store and should persist.

### If It Does Happen

**1. Check If Data Is Actually Gone**
```javascript
const data = JSON.parse(localStorage.getItem('nss-care-network-data'));
console.log('Data still there:', data ? 'YES' : 'NO');
console.log('Record counts:', {
  donors: data?.donors.length || 0,
  camps: data?.camps.length || 0
});
```

**2. Re-initialize**
Click "Initialize Sample Data" button again (may need to clear localStorage first)

**3. Check for Errors**
Look in browser console for any errors during page load.

---

## 🟡 Issue: Slow loading times

### Normal Behavior
localStorage operations are instant! If app feels slow:

### Possible Causes
1. **Too much data** - localStorage has limits (~5-10MB)
2. **Large images loading** - Unsplash images may be slow
3. **React re-renders** - Check component optimization

### Solutions
1. Clear unnecessary data from localStorage
2. Use image placeholders
3. Check console for performance warnings

---

## 🔴 Critical: Console shows API errors

### Error: "404 Not Found"
**Cause**: API endpoint doesn't exist or wrong path

**Solution**: 
- Check the endpoint URL
- Ensure it starts with `/make-server-fa4fa155/`
- Verify endpoint exists in server code

### Error: "500 Internal Server Error"
**Cause**: Server-side error in Edge Function

**Solution**:
- Check request data format
- Look at error details in Network tab
- Try simpler request first

### Error: "CORS Error"
**Cause**: Cross-origin request blocked

**Solution**:
- Edge Function has CORS enabled
- Try hard refresh
- Clear browser cache

---

## 🟢 How to Verify Everything is Working

### Quick Health Check

**1. localStorage Available**
```javascript
console.log('localStorage works:', typeof localStorage !== 'undefined');
console.log('Storage quota:', navigator.storage ? 'available' : 'not available');
```

**2. Sample Data Loaded**
```javascript
// Check all data types
const data = JSON.parse(localStorage.getItem('nss-care-network-data'));
const initialized = localStorage.getItem('nss-data-initialized');

console.log('Initialized:', initialized === 'true');
console.log('Donors:', data?.donors.length || 0);
console.log('Camps:', data?.camps.length || 0);
console.log('Missions:', data?.reliefMissions.length || 0);
console.log('Help Requests:', data?.helpRequests.length || 0);
```

**3. UI Working**
- [ ] Blood donors page shows records
- [ ] Health camps page shows records
- [ ] Relief missions show records
- [ ] Forms can submit
- [ ] No console errors

---

## 🆘 Still Having Issues?

### Debug Information to Collect

When asking for help, provide:

1. **Error Message** (exact text from console)
2. **Browser** (Chrome, Firefox, Safari, etc.)
3. **What You Were Doing** (which page, which button)
4. **Console Screenshot** (F12 → Console tab)
5. **Network Tab** (F12 → Network, show failed requests)

### Run This Diagnostic
```javascript
// Copy and run in browser console
(function diagnostic() {
  console.log('=== NSS Care Network Diagnostic ===');
  
  // 1. Check localStorage available
  try {
    const test = localStorage.getItem('test');
    console.log('✅ localStorage: Available');
  } catch (e) {
    console.log('❌ localStorage: NOT available -', e.message);
    return;
  }
  
  // 2. Check initialization
  const initialized = localStorage.getItem('nss-data-initialized');
  console.log(initialized === 'true' ? '✅ Data: Initialized' : '⚠️ Data: Not initialized yet');
  
  // 3. Check data
  try {
    const data = JSON.parse(localStorage.getItem('nss-care-network-data'));
    if (data) {
      console.log('✅ Donors:', data.donors?.length || 0);
      console.log('✅ Camps:', data.camps?.length || 0);
      console.log('✅ Missions:', data.reliefMissions?.length || 0);
      console.log('✅ Help Requests:', data.helpRequests?.length || 0);
      console.log('✅ Volunteers:', data.volunteers?.length || 0);
    } else {
      console.log('⚠️ No data found - click Initialize button');
    }
  } catch (e) {
    console.log('❌ Data parsing failed:', e.message);
  }
  
  // 4. Check storage usage
  const dataSize = new Blob([localStorage.getItem('nss-care-network-data') || '']).size;
  console.log('📊 Data size:', (dataSize / 1024).toFixed(2), 'KB');
  
  console.log('=== Diagnostic Complete ===');
})();
```

---

## 🎯 Reset Everything (Nuclear Option)

If nothing works, start completely fresh:

### 1. Clear Everything
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
```

### 2. Hard Refresh
- Press Ctrl+Shift+R (Windows/Linux)
- Press Cmd+Shift+R (Mac)
- Or clear browser cache manually

### 3. Re-initialize
- Page should reload fresh
- "Initialize Sample Data" button appears
- Click it
- Wait for success
- Test features

---

## 📊 Expected Behavior After Setup

### What You Should See

**Blood Donors Page:**
- 3 donor cards
- Filter by blood group works
- Search by location works

**Health Camps Page:**
- 2 camp cards
- Filter by type works
- Registration button works

**Emergency Help:**
- 1 existing request in feed
- Form submits successfully
- New requests appear immediately

**Disaster Relief:**
- 2 mission cards
- Status badges show correctly
- Volunteer registration works

**Statistics:**
- Total donors: 3
- Total camps: 2
- Total missions: 2

---

## 📞 Quick Reference

### Important localStorage Keys
- Data: `nss-care-network-data` (all app data)
- Init Flag: `nss-data-initialized` (setup status)

### Console Commands
```javascript
// View all data
const data = JSON.parse(localStorage.getItem('nss-care-network-data'));
console.log(data);

// Check initialization
console.log('Initialized:', localStorage.getItem('nss-data-initialized'));

// Count all records
console.log({
  donors: data.donors.length,
  camps: data.camps.length,
  missions: data.reliefMissions.length,
  requests: data.helpRequests.length
});

// Clear and reset
localStorage.clear();
location.reload();

// View specific data type
console.log('Donors:', data.donors);
console.log('Camps:', data.camps);
```

---

## ✅ Success Indicators

You'll know everything is working when:

✅ No console errors  
✅ "Initialize Sample Data" button clicked and disappeared  
✅ Blood donors page loads 3 records  
✅ Health camps page loads 2 records  
✅ Relief missions load 2 records  
✅ Forms submit successfully  
✅ Data persists after refresh  

---

**Most issues are solved by clicking Initialize button and refreshing!** 🎉

For persistent issues, run the diagnostic script and share the output.
