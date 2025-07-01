{/* Elite Program Card */}
<div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
  // ... existing code ...
  <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
    <ProgramFeature Icon={Dumbbell} title="Advanced Training" description="Specialized coaching and tactical development" />
    // Remove the Athletic Diet feature from here
  </div>
</div>

{/* Residential Program Card */}
<div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
  // ... existing code ...
  <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
    <ProgramFeature Icon={GraduationCap} title="Quality Education" description="Academic support alongside football development" />
    <ProgramFeature Icon={Globe} title="National & International Exposure" description="Opportunities to compete at higher levels and gain visibility" />
    <ProgramFeature Icon={UserCheck} title="Personal Mentorship" description="Individual guidance for personal and professional development" />
    // Add the Athletic Diet feature here
    <ProgramFeature Icon={Utensils} title="Athletic Diet" description="Nutrition guidance for optimal performance" />
  </div>
</div>

// ... existing code ... 