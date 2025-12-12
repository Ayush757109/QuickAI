import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);

  // FETCH PUBLISHED CREATIONS
  const fetchCreations = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }

    setLoading(false);
  };

  // LIKE TOGGLE FUNCTION
  const toggleLike = async (id) => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        "/api/user/toggle-like-creations",
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  return !loading ? (
    <div  className="flex-1 h-full flex flex-col gap-4 p-6 text-gray-900">
      <h2 className="text-xl font-semibold">Creations</h2>

      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && (
          <div className="col-span-full text-center text-gray-500 py-10">
            Loading creations...
          </div>
        )}

        {!loading && creations.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No published creations yet.
          </div>
        )}

        {!loading &&
          creations.map((creation, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden">
              <img
                src={creation.content}
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end justify-between opacity-0 group-hover:opacity-100 transition p-3 text-white">
                <p className="text-sm line-clamp-2">{creation.prompt}</p>

                <div className="flex items-center gap-1">
                  <p>{creation.likes?.length || 0}</p>

                  <Heart
                    onClick={() => toggleLike(creation.id)}
                    className={`h-5 w-5 cursor-pointer ${
                      creation.likes?.includes(user?.id)
                        ? "fill-red-500 text-red-500"
                        : "text-white"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  ):(
      <div className="flex justify-center items-center h-full">
        <span className="w-10 h-10 my-1 rounded-full border-3
          border-primary border-t-transparent animate-spin"></span>
      </div>
  )
};

export default Community;
