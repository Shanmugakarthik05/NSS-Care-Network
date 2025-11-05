import { useEffect, useState } from "react";
import { Heart, Calendar, Users } from "lucide-react";

export function ImpactCounter() {
  const [counts, setCounts] = useState({
    donors: 0,
    camps: 0,
    volunteers: 0,
  });

  const targetCounts = {
    donors: 12450,
    camps: 847,
    volunteers: 8920,
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        donors: Math.floor(targetCounts.donors * progress),
        camps: Math.floor(targetCounts.camps * progress),
        volunteers: Math.floor(targetCounts.volunteers * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targetCounts);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: Heart,
      label: "Blood Donors Registered",
      value: counts.donors.toLocaleString(),
      color: "#E63946",
    },
    {
      icon: Calendar,
      label: "Health Camps Conducted",
      value: counts.camps.toLocaleString(),
      color: "#0077B6",
    },
    {
      icon: Users,
      label: "Active Volunteers",
      value: counts.volunteers.toLocaleString(),
      color: "#10B981",
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-2">Our Impact</h2>
          <p className="text-gray-600">Making a difference together</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
              </div>
              <div className="text-gray-900 mb-1">{stat.value}</div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
