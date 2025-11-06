# ⚡ Quick Reference - NSS Care Network Portal

## 🚀 Instant Start

**The app works immediately - no setup required!**

---

## 🔑 Demo Login Credentials

### College Admin
```
Email: college@admin.com
Password: anything
```

### Hospital Admin
```
Email: hospital@admin.com
Password: anything
```

### Super Admin
```
Email: admin@nss.gov.in
Password: anything
```

### Volunteer
```
Register through public interface
```

---

## 📊 Sample Data Quick View

### Blood Donors (3)
- Rahul Sharma - O+ - Mumbai
- Priya Patel - A+ - Pune
- Amit Kumar - B+ - Delhi

### Health Camps (3)
- Blood Donation Camp - Nov 15 - Mumbai
- Eye Checkup Camp - Nov 20 - City Hospital
- Health Checkup - Nov 25 - Thane

### Relief Missions (3)
- Flood Relief - Mumbai (Active)
- Cyclone Relief - Raigad (Active)
- Drought Relief - Pune (Controlled)

---

## 🎨 Color Codes

```css
/* Action/Emergency */
--red: #E63946

/* Trust/Structure */
--blue: #0077B6

/* Success */
--green: (default Tailwind green)

/* Warning */
--yellow: (default Tailwind yellow)
```

---

## 📱 Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| App.tsx | / | Main app |
| Navbar | /components | Navigation |
| HomePage | /components | Landing page |
| BloodDonorFinder | /components | Donor search |
| HealthCamps | /components | Camps list |
| DisasterReliefModule | /components | Relief ops |
| *Dashboard | /components | Role dashboards |

---

## 🎯 Common Tasks

### Add New Feature
1. Create component in `/components/`
2. Import in `App.tsx`
3. Add navigation route
4. Update api.ts if needed

### Modify Styles
- Global: `/styles/globals.css`
- Component: Tailwind classes inline
- Tokens: CSS variables in globals.css

### Update Sample Data
- Edit `/utils/api.ts`
- Find `getMockData()` function
- Modify relevant data section

### Add New User Role
1. Update type in `App.tsx`
2. Create new dashboard component
3. Add to login options
4. Update routing logic

---

## 🔧 File Locations

```
Key Files:
├── App.tsx              # Main app component
├── utils/api.ts         # Mock API & data
├── styles/globals.css   # Global styles
└── components/
    ├── Navbar.tsx       # Top navigation
    ├── HomePage.tsx     # Landing page
    └── ui/              # Shadcn components
```

---

## 📚 Documentation

- **README.md** - Full project overview
- **GETTING_STARTED.md** - User guide
- **DEMO_MODE.md** - Demo details
- **PROJECT_OVERVIEW.md** - Tech overview
- **CHANGELOG.md** - Recent changes
- **QUICK_REFERENCE.md** - This file

---

## ⚡ Quick Commands

### Test All Workflows
1. Browse as public user
2. Login as college admin
3. Create a camp
4. Assign volunteers
5. Mark attendance
6. Generate certificates

### Check Responsiveness
- Resize browser window
- Test mobile view (< 640px)
- Test tablet view (640-1024px)
- Test desktop view (> 1024px)

### Verify Features
- Search donors by blood group
- Filter camps by type
- Submit emergency request
- Register for relief mission
- View all dashboards

---

## 🎨 UI Component Guide

### Buttons
```tsx
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Red</Button>
<Button size="sm">Small</Button>
```

### Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Badges
```tsx
<Badge>Default</Badge>
<Badge variant="destructive">Red</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## 🐛 Troubleshooting

### Issue: Data not showing
**Solution**: Refresh page - demo mode resets

### Issue: Form not submitting
**Solution**: Check form validations, all required fields

### Issue: Dashboard not loading
**Solution**: Clear localStorage, try again

### Issue: Console errors
**Solution**: Should be zero - if errors appear, check for conflicts

---

## 💡 Pro Tips

1. **Dismiss Banner**: Click X on demo banner for cleaner screenshots
2. **Test Forms**: All forms validate - required fields are marked
3. **Mobile First**: Design is mobile-optimized
4. **Fast Navigation**: Use navbar for quick access
5. **Role Testing**: Test all 5 user roles for complete view

---

## 🎯 Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Blood Search | ✅ | Fully functional |
| Health Camps | ✅ | Complete workflow |
| Emergency Help | ✅ | Form submission works |
| Disaster Relief | ✅ | All mission types |
| Volunteer System | ✅ | Points & certificates |
| All Dashboards | ✅ | 5 role-specific views |
| Responsive Design | ✅ | All screen sizes |
| Form Validation | ✅ | All forms validate |

---

## 📞 Quick Access

### Main Sections
- Home: Landing page with overview
- Blood Finder: Search donors
- Health Camps: Browse camps
- Emergency Help: Submit requests
- Disaster Relief: View missions
- Login: Access dashboards

### Dashboard Sections
- Home: Overview & stats
- Manage: Role-specific management
- Analytics: Data & charts (where applicable)
- Settings: User preferences (where applicable)

---

## 🎨 Customization Points

### Easy to Change
- Colors in `globals.css`
- Sample data in `api.ts`
- Component text/labels
- Badge colors/variants

### Moderate Changes
- Add new features
- Modify layouts
- Add new user roles
- Extend workflows

### Advanced Changes
- Add real backend
- Implement authentication
- Real-time features
- Payment integration

---

## ✅ Quality Checklist

Before demo/presentation:
- [ ] Dismiss demo banner for clean look
- [ ] Test all user roles
- [ ] Check responsive design
- [ ] Verify all forms work
- [ ] Console is clean (zero errors)
- [ ] All links work
- [ ] Sample data is loaded

---

**Keep this handy for quick reference!** 📌
