import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { eventGroupsAPI, eventsAPI } from '@/app/services/api.jsx';
import { EventGroup, Event } from '@/app/types/index.js';
import { LogOut, FolderPlus, Plus, FolderOpen } from 'lucide-react';
import { EventGroupCard } from './EventGroupCard';
import { CreateGroupModal } from './CreateGroupModal';
import { EventListModal } from './EventListModal';

export function EventPlannerDashboard() {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await eventGroupsAPI.getAll();
      setGroups(data);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (data) => {
    try {
      const newGroup = await eventGroupsAPI.create(data);
      setGroups([...groups, newGroup]);
      setShowCreateGroup(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bună, {user?.firstName}!
              </h1>
              <p className="text-gray-600">Panou organizator evenimente</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Deconectare</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <button
            onClick={() => setShowCreateGroup(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <FolderPlus size={20} />
            <span>Creează grup nou</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Se încarcă...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FolderOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nu ai grupuri de evenimente
            </h3>
            <p className="text-gray-600 mb-6">
              Creează primul tău grup pentru a organiza evenimente
            </p>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Creează grup</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <EventGroupCard
                key={group.id}
                group={group}
                onClick={() => setSelectedGroup(group)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onSubmit={handleCreateGroup}
        />
      )}

      {selectedGroup && (
        <EventListModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
} 