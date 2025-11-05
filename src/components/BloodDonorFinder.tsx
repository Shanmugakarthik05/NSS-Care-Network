import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DonorCard, Donor } from "./DonorCard";
import { donorsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

export function BloodDonorFinder() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const districts = ["Mumbai", "Pune", "Bangalore", "Delhi", "Chennai", "Kolkata"];

  const handleSearch = async () => {
    if (!bloodGroup) {
      toast.error("Please select a blood group");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await donorsApi.getAll({
        bloodGroup,
        district: district || undefined,
      });
      setDonors(response.donors || []);
      
      if (response.donors.length === 0) {
        toast.info("No donors found matching your criteria");
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast.error("Failed to fetch donors. Please try again.");
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#E63946] to-[#d12836] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white mb-3">Find Blood Donor</h1>
          <p className="text-white/90">
            Search for verified blood donors in your area
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#0077B6]" />
            <h3 className="text-gray-900">Search Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Blood Group *
              </label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                District/City *
              </label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((dist) => (
                    <SelectItem key={dist} value={dist}>
                      {dist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Pincode (Optional)
              </label>
              <Input
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-[#0077B6] hover:bg-[#005f8f]"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Searching..." : "Search Donors"}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        {searched && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-gray-900 mb-1">
                  {loading ? "Searching..." : "Available Donors"}
                </h2>
                <p className="text-sm text-gray-600">
                  {loading 
                    ? "Please wait..." 
                    : `Found ${donors.length} donor${donors.length !== 1 ? 's' : ''} matching your criteria`
                  }
                </p>
              </div>
              {donors.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" className="text-sm">
                    Sort by Distance
                  </Button>
                </div>
              )}
            </div>

            {/* Donor Results */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B6]"></div>
                <p className="text-gray-600 mt-4">Searching for donors...</p>
              </div>
            ) : donors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor) => (
                  <DonorCard key={donor.id} donor={donor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No donors found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or check back later.
                </p>
              </div>
            )}
          </>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            <strong>Privacy Notice:</strong> Contact information is partially masked to protect donor privacy. 
            Please use the "Show Contact" button responsibly and only contact donors for genuine blood requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
