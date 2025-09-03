# Step 3: Multiple Diagram Types - Testing Checklist

## ✅ Pre-Testing Setup
- [x] Backend server running on port 3001
- [x] Frontend server running on port 5173  
- [x] Database schema updated with Diagram and DiagramBlock models
- [x] API endpoints responding (requiring auth as expected)

## 📝 Manual Testing Checklist

### Phase 1: Access & Navigation
- [ ] Open http://localhost:5173 in browser
- [ ] Login/Register successfully
- [ ] Navigate to dashboard
- [ ] Create new model OR open existing model
- [ ] Verify you see the enhanced model view with sidebar

### Phase 2: Diagram Manager Sidebar
- [ ] Sidebar shows "Diagrams" section
- [ ] "Create New Diagram" button is visible
- [ ] If no diagrams exist, shows "No diagrams yet" message
- [ ] If diagrams exist, they are listed with type badges

### Phase 3: Diagram Creation
- [ ] Click "Create New Diagram" button
- [ ] Modal opens with name input and type dropdown
- [ ] Type dropdown shows "BDD" and "IBD" options
- [ ] Create BDD diagram with name "Test BDD"
- [ ] Verify BDD appears in sidebar with blue "BDD" badge
- [ ] Create IBD diagram with name "Test IBD" 
- [ ] Verify IBD appears in sidebar with green "IBD" badge

### Phase 4: Diagram Switching
- [ ] Click on BDD diagram in sidebar
- [ ] Header updates to show "Test BDD (BDD)"
- [ ] Diagram editor loads/switches to BDD view
- [ ] Click on IBD diagram in sidebar
- [ ] Header updates to show "Test IBD (IBD)"
- [ ] Diagram editor switches to IBD view
- [ ] Switching works smoothly without page reload

### Phase 5: Block Management per Diagram
- [ ] Select BDD diagram
- [ ] Create/add 2-3 blocks to BDD
- [ ] Note positions of blocks in BDD
- [ ] Switch to IBD diagram
- [ ] Verify IBD is empty/has different blocks
- [ ] Add different blocks to IBD in different positions
- [ ] Switch back to BDD
- [ ] Verify BDD still has original blocks in same positions

### Phase 6: Persistence Testing
- [ ] Refresh the browser page
- [ ] Navigate back to your model
- [ ] Both diagrams still appear in sidebar
- [ ] Switch between diagrams - all data preserved
- [ ] Block positions maintained per diagram
- [ ] Diagram types still show correct badges

### Phase 7: Advanced Features
- [ ] Try renaming a diagram (if implemented)
- [ ] Try deleting a diagram (if delete button exists)
- [ ] Test with multiple models - diagrams are model-specific
- [ ] Test diagram data persistence across sessions

## 🐛 What to Look For (Potential Issues)
- [ ] Sidebar not appearing
- [ ] Create diagram modal not working
- [ ] Type badges showing wrong colors/types
- [ ] Diagrams not switching properly
- [ ] Block positions not saved per diagram
- [ ] Data not persisting after refresh
- [ ] Console errors in browser developer tools

## 📊 Success Criteria
✅ **Step 3 is successful if:**
1. You can create both BDD and IBD diagrams
2. Diagrams show different colored type badges
3. You can switch between diagrams seamlessly
4. Each diagram maintains its own block positions
5. All data persists after page refresh
6. No console errors during operation

## 🔧 Troubleshooting
If something doesn't work:
1. Check browser console for JavaScript errors
2. Check backend terminal for API errors
3. Verify you're logged in properly
4. Try refreshing the page
5. Check network tab for failed API calls
