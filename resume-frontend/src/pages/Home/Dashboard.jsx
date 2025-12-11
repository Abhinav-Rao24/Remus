import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, Trash2 } from 'lucide-react';
import TopNav from '@/components/layouts/TopNav';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import axios from '@/utils/AxiosInstance';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resume');
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      await axios.delete(`/api/resume/${id}`);
      toast.success('Project deleted successfully');
      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <Button onClick={() => navigate('/create')}>
            Create New Project
          </Button>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : resumes.length === 0 ? (
          <Empty
            icon={<FilePlus className="h-16 w-16 text-muted-foreground" />}
            title="No projects yet"
            description="Create your first project to get started"
          >
            <Button onClick={() => navigate('/create')}>
              Create Project
            </Button>
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
                  Last updated: {new Date(resume.updated_at || resume.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/edit/${resume._id}`)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(resume._id, resume.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;