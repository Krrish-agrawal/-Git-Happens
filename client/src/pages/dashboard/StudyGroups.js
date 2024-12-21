import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const StudyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth(); // Get current user from auth context

  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    description: '',
    meetingTime: '',
    maxMembers: 10
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/api/study-groups');
      const validGroups = (response.data.groups || []).filter(group => 
        group && group.name && group.members && Array.isArray(group.members)
      );
      setGroups(validGroups);
      setError(null);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load study groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/study-groups', formData);
      setGroups([response.data.group, ...groups]);
      setShowCreateForm(false);
      setFormData({
        name: '',
        topic: '',
        description: '',
        meetingTime: '',
        maxMembers: 10
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create study group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await api.post(`/api/study-groups/${groupId}/join`);
      setGroups(groups.map(group => 
        group._id === groupId 
          ? { ...group, members: [...group.members, user.id] }
          : group
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join group');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to leave this study group?')) {
      return;
    }

    try {
      await api.post(`/api/study-groups/${groupId}/leave`);
      setGroups(groups.map(group => 
        group._id === groupId 
          ? { ...group, members: group.members.filter(id => id !== user.id) }
          : group
      ));
    } catch (err) {
      console.error('Error leaving group:', err);
      setError(err.response?.data?.error || 'Failed to leave group');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this study group? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/study-groups/${groupId}`);
      setGroups(prevGroups => prevGroups.filter(group => group._id !== groupId));
    } catch (err) {
      console.error('Error deleting group:', err);
      setError(err.response?.data?.error || 'Failed to delete group');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Study Groups</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Create Group
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create Group Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Study Group</h2>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Group Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., Calculus Study Group"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Topic</label>
                <input
                  type="text"
                  name="topic"
                  required
                  value={formData.topic}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., Calculus I"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Describe your study group..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Meeting Time</label>
                <input
                  type="text"
                  name="meetingTime"
                  value={formData.meetingTime}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., Mondays at 5 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Members</label>
                <input
                  type="number"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleChange}
                  min="2"
                  max="50"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => group && (
          <div key={group._id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {group.name || 'Unnamed Group'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {group.topic || 'No topic specified'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Members: {(group.members || []).length} / {group.maxMembers || 10}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {user && (
                  group.owner_id === user.id ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                      Owner
                    </span>
                  ) : group.members.includes(user.id) ? (
                    <button
                      onClick={() => handleLeaveGroup(group._id)}
                      className="px-4 py-2 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100"
                    >
                      Leave Group
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinGroup(group._id)}
                      disabled={group.members.length >= group.maxMembers}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        group.members.length >= group.maxMembers
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {group.members.length >= group.maxMembers ? 'Full' : 'Join Group'}
                    </button>
                  )
                )}
                {user && group.owner_id === user.id && (
                  <button
                    onClick={() => handleDelete(group._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-gray-600">
              {group.description || 'No description available'}
            </p>
            {group.meetingTime && (
              <p className="mt-2 text-sm text-gray-500">
                Meets: {group.meetingTime}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyGroups; 