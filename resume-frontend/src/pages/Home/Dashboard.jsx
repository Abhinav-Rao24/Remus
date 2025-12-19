import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, Trash2, FolderOpen, Share2, Trash, Plus } from 'lucide-react';
import TopNav from '@/components/layouts/TopNav';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import axios from '@/utils/AxiosInstance';
import toast from 'react-hot-toast';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'shared', 'trashed'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, [activeFilter]);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resume');
      let filteredResumes = response.data;

      // Filter based on active filter
      if (activeFilter === 'trashed') {
        filteredResumes = filteredResumes.filter(r => r.isTrashed);
      } else if (activeFilter === 'all') {
        filteredResumes = filteredResumes.filter(r => !r.isTrashed);
      } else if (activeFilter === 'shared') {
        // Placeholder for shared projects (implement later)
        filteredResumes = [];
      }

      setResumes(filteredResumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (resume) => {
    setResumeToDelete(resume);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!resumeToDelete) return;

    const { _id: id, title } = resumeToDelete;

    if (activeFilter === 'trashed') {
      // Permanent delete
      try {
        await axios.delete(`/api/resume/${id}`);
        toast.success('Project permanently deleted');
        fetchResumes();
      } catch (error) {
        console.error('Error deleting resume:', error);
        toast.error('Failed to delete project');
      }
    } else {
      // Move to trash (soft delete)
      try {
        await axios.put(`/api/resume/${id}`, { isTrashed: true, trashedAt: new Date() });
        toast.success('Project moved to trash');
        fetchResumes();
      } catch (error) {
        console.error('Error trashing resume:', error);
        toast.error('Failed to move to trash');
      }
    }
    setDeleteDialogOpen(false);
    setResumeToDelete(null);
  };

  const handleRestore = async (id, title) => {
    try {
      await axios.put(`/api/resume/${id}`, { isTrashed: false, trashedAt: null });
      toast.success('Project restored');
      fetchResumes();
    } catch (error) {
      console.error('Error restoring resume:', error);
      toast.error('Failed to restore project');
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Projects', icon: FolderOpen },
    { id: 'shared', label: 'Shared Projects', icon: Share2 },
    { id: 'trashed', label: 'Trashed Projects', icon: Trash },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`w-64 bg-white border-r flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
          <div className="p-6">
            <Button onClick={() => navigate('/create')} className="w-full mb-6">
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </Button>

            <div className="space-y-2">
              {filterOptions.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${activeFilter === filter.id
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                {filterOptions.find(f => f.id === activeFilter)?.label}
              </h1>
              <p className="text-gray-600 mt-1">
                {resumes.length} {resumes.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              View Projects
            </Button>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : resumes.length === 0 ? (
            <Empty
              icon={<FilePlus className="h-16 w-16 text-muted-foreground" />}
              title={`No ${activeFilter === 'trashed' ? 'trashed' : ''} projects yet`}
              description={
                activeFilter === 'trashed'
                  ? 'Deleted projects will appear here'
                  : 'Create your first project to get started'
              }
            >
              {activeFilter !== 'trashed' && (
                <Button onClick={() => navigate('/create')}>
                  Create Project
                </Button>
              )}
            </Empty>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card key={resume._id} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{resume.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {resume.description || 'No description'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {activeFilter === 'trashed' ? 'Deleted: ' : 'Last updated: '}
                    {new Date(resume.trashedAt || resume.updated_at || resume.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    {activeFilter === 'trashed' ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleRestore(resume._id, resume.title)}
                          className="flex-1 cursor-pointer"
                        >
                          Restore
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => initiateDelete(resume)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/edit/${resume._id}`)}
                          className="flex-1 cursor-pointer"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => initiateDelete(resume)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activeFilter === 'trashed'
                ? 'Permanently delete this project?'
                : 'Move to trash?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {activeFilter === 'trashed'
                ? `This action cannot be undone. This will permanently delete "${resumeToDelete?.title}" and remove your data from our servers.`
                : `"${resumeToDelete?.title}" will be moved to the trash. You can restore it later.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResumeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {activeFilter === 'trashed' ? 'Delete Permanently' : 'Move to Trash'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;