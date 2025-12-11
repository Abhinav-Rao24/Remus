import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProfileForm = ({ data, updateData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle nested state updates if necessary, or flatter structure
        updateData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                [name]: value
            }
        }));
    };

    const profile = data.profile || {};

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
                <p className="text-gray-500 text-sm">Start with your basic information.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        placeholder="e.g. John Doe"
                        value={profile.fullName || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="designation">Job Title</Label>
                    <Input
                        id="designation"
                        name="designation"
                        placeholder="e.g. Software Engineer"
                        value={profile.designation || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={profile.email || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="+1 234 567 890"
                        value={profile.phone || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                    id="summary"
                    name="summary"
                    placeholder="Briefly describe your professional background..."
                    className="min-h-[120px]"
                    value={profile.summary || ''}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="e.g. New York, USA" value={profile.location || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="website">Website / Portfolio</Label>
                    <Input id="website" name="website" placeholder="https://..." value={profile.website || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/..." value={profile.linkedin || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input id="github" name="github" placeholder="https://github.com/..." value={profile.github || ''} onChange={handleChange} />
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
