"use client";

import { useState } from "react";
import { Users, Clock } from "lucide-react";
import { mockFriends, mockActivities } from "../lib/data";
import FriendModal from "../components/FriendModal";

export default function Friends() {
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (friend: any) => {
    setSelectedFriend(friend);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-12 w-full animate-in fade-in duration-500">
      
      {/* Friends List Section */}
      <section>
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white mb-8">
          <Users className="text-yellow-400 w-8 h-8"/> My Friends
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFriends.map(friend => (
            <div 
              key={friend.id} 
              onClick={() => openModal(friend)}
              className="bg-[#121214] border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-yellow-400/50 hover:bg-zinc-900/50 transition-all group"
            >
              <img src={friend.avatar} alt={friend.name} className="w-16 h-16 rounded-full bg-zinc-800 object-cover" />
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">{friend.name}</h3>
                <p className="text-zinc-400 text-sm">Currently on a {friend.stats.dayStreak}-day streak!</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-zinc-800" />

      {/* Activity Feed Section */}
      <section className="max-w-3xl">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-white mb-6">
          <Clock className="text-zinc-400 w-6 h-6"/> Recent Activity
        </h2>
        
        <div className="flex flex-col gap-4">
          {mockActivities.map(activity => {
            // Finde den passenden Freund für das Avatar-Bild
            const friend = mockFriends.find(f => f.name === activity.friendName);
            
            return (
              <div key={activity.id} className="bg-[#121214] border border-zinc-800 rounded-2xl p-5 flex items-start sm:items-center gap-4">
                <img src={friend?.avatar} alt={activity.friendName} className="w-12 h-12 rounded-full bg-zinc-800 shrink-0" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1">
                  <p className="text-zinc-300">
                    <span className="font-bold text-white cursor-pointer hover:underline" onClick={() => friend && openModal(friend)}>
                      {activity.friendName}
                    </span>
                    {" "}{activity.action}{" "}
                    <span className="font-semibold text-yellow-400 italic">"{activity.bookTitle}"</span>
                  </p>
                  <span className="text-zinc-600 text-sm sm:ml-auto shrink-0">{activity.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FriendModal 
        friend={selectedFriend} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}