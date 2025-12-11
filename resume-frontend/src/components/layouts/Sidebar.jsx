import React from 'react';
import {
    User,
    Briefcase,
    GraduationCap,
    Code,
    Award,
    Globe,
    Heart,
    LayoutTemplate,
    Palette
} from 'lucide-react';
import { cn } from "@/lib/utils";

const sections = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'experience', label: 'Work Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Globe },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'interests', label: 'Interests', icon: Heart },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'theme', label: 'Theme', icon: Palette },
];

const Sidebar = ({ activeSection, setActiveSection }) => {
    return (
        <div className="w-64 border-r bg-white h-full overflow-y-auto flex flex-col">
            <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-700">Sections</h3>
            </div>
            <div className="flex-1 py-4">
                {sections.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveSection(id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-amber-50",
                            activeSection === id ? "bg-amber-50 text-amber-600 border-r-2 border-amber-600" : "text-gray-600"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
