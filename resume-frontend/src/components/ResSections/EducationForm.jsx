import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const EducationForm = ({ data, updateData }) => {
    const education = data.education || [];

    const addEducation = () => {
        updateData(prev => ({
            ...prev,
            education: [
                ...(prev.education || []),
                { institution: '', degree: '', startDate: '', endDate: '', description: '' }
            ]
        }));
    };

    const removeEducation = (index) => {
        updateData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (index, field, value) => {
        const newEducation = [...education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        updateData(prev => ({ ...prev, education: newEducation }));
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Education</h2>
                    <p className="text-gray-500 text-sm">Add your educational background.</p>
                </div>
                <Button onClick={addEducation} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
            </div>

            {education.map((edu, index) => (
                <Card key={index} className="p-4 space-y-4 relative group">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeEducation(index)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Institution</Label>
                            <Input
                                value={edu.institution}
                                onChange={(e) => handleChange(index, 'institution', e.target.value)}
                                placeholder="e.g. University of Technology"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input
                                value={edu.degree}
                                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                                placeholder="e.g. Bachelor of Science"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                value={edu.startDate}
                                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                placeholder="e.g. 2016"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                value={edu.endDate}
                                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                placeholder="e.g. 2020"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Textarea
                            value={edu.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                            placeholder="Achievements, GPA, etc."
                            className="min-h-[80px]"
                        />
                    </div>
                </Card>
            ))}

            {education.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No education added yet.
                </div>
            )}
        </div>
    );
};

export default EducationForm;
