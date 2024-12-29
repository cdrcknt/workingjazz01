import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const AboutDevelopers = () => {
  const developers = [
    {
      name: 'Developer 1',
      role: 'Full Stack Developer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev1',
      bio: 'Specialized in frontend development and UI/UX design',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      social: {
        github: '#',
        linkedin: '#',
        email: 'dev1@example.com'
      }
    },
    {
      name: 'Developer 2',
      role: 'Backend Developer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev2',
      bio: 'Expert in database design and API development',
      skills: ['Node.js', 'PostgreSQL', 'Supabase', 'Express'],
      social: {
        github: '#',
        linkedin: '#',
        email: 'dev2@example.com'
      }
    },
    {
      name: 'Developer 3',
      role: 'Full Stack Developer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev3',
      bio: 'Focused on system architecture and performance optimization',
      skills: ['React', 'Node.js', 'AWS', 'Docker'],
      social: {
        github: '#',
        linkedin: '#',
        email: 'dev3@example.com'
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-pink-800 mb-2">About Developers</h3>
        <p className="text-pink-600">Meet the team behind Jazz Coffee Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {developers.map((dev, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="text-center mb-6">
              <img
                src={dev.image}
                alt={dev.name}
                className="w-32 h-32 mx-auto rounded-full border-4 border-pink-100 mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-900">{dev.name}</h4>
              <p className="text-pink-600 font-medium">{dev.role}</p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-center">{dev.bio}</p>

              <div className="flex flex-wrap gap-2 justify-center">
                {dev.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-center space-x-4 pt-4">
                <a href={dev.social.github} className="text-gray-500 hover:text-pink-600 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href={dev.social.linkedin} className="text-gray-500 hover:text-pink-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href={`mailto:${dev.social.email}`} className="text-gray-500 hover:text-pink-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutDevelopers;