import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const ExperienceForm = ({ data, updateData }) => {
    const experiences = data.experience || [];

    const addExperience = () => {
        updateData(prev => ({
            ...prev,
            experience: [
                ...(prev.experience || []),
                { company: '', position: '', startDate: '', endDate: '', description: '' }
            ]
        }));
    };

    const removeExperience = (index) => {
        updateData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (index, field, value) => {
        const newExperience = [...experiences];
        newExperience[index] = { ...newExperience[index], [field]: value };
        updateData(prev => ({ ...prev, experience: newExperience }));
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Work Experience</h2>
                    <p className="text-gray-500 text-sm">Add your professional experience.</p>
                </div>
                <Button onClick={addExperience} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Position
                </Button>
            </div>

            {experiences.map((exp, index) => (
                <Card key={index} className="p-4 space-y-4 relative group">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExperience(index)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input
                                value={exp.company}
                                onChange={(e) => handleChange(index, 'company', e.target.value)}
                                placeholder="e.g. Google"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input
                                value={exp.position}
                                onChange={(e) => handleChange(index, 'position', e.target.value)}
                                placeholder="e.g. Senior Developer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                value={exp.startDate}
                                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                placeholder="e.g. Jan 2020"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                value={exp.endDate}
                                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                placeholder="e.g. Present"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={exp.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                            placeholder="Describe your responsibilities..."
                            className="min-h-[100px]"
                        />
                    </div>
                </Card>
            ))}

            {experiences.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No experience added yet. Click the button above to add one.
                </div>
            )}
        </div>
    );
};

export default ExperienceForm;
