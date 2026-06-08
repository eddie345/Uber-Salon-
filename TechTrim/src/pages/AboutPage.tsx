import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconUser, IconScissors, IconUsers, IconFlag, IconBriefcase, IconDeviceMobile, IconCreditCard, IconRocket } from '@tabler/icons-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Section 1 - Hero */}
      <section className="w-full min-h-[480px] flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #006B3F 0%, #004D2C 60%, #1A1A1A 100%)' }}>
        <div className="max-width-container px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-bold mb-8" style={{ color: '#006B3F' }}>
            <IconFlag className="w-5 h-5" /> Made in Ghana, Built for Ghana
          </div>
          
          <h1 className="font-black text-white leading-[1.1] mb-6" style={{ fontSize: '56px' }}>
            <div className="block">We're connecting Ghana</div>
            <div className="block">one <span style={{ color: '#FCD116' }}>trim</span> at a time.</div>
          </h1>
          
          <p className="text-white mb-10 mx-auto leading-relaxed" style={{ fontSize: '18px', maxWidth: '580px', opacity: '0.7' }}>
            TrimConnect GH was built to give every Ghanaian access to skilled barbers and hair dressers — and to give every artisan the tools to build a thriving business.
          </p>
          
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-white font-bold h-[52px] rounded-[10px] px-9 transition-all hover:shadow-lg hover:scale-105"
            style={{ color: '#006B3F' }}
          >
            Join TrimConnect GH <IconArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Section 2 - Stats Bar */}
      <section className="bg-white py-12 border-b" style={{ borderColor: '#F0F0F0' }}>
        <div className="max-width-container px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="font-black mb-2" style={{ fontSize: '40px', color: '#006B3F' }}>500+</p>
              <p className="text-sm font-medium text-muted">Verified Artisans</p>
            </div>
            <div className="text-center">
              <p className="font-black mb-2" style={{ fontSize: '40px', color: '#006B3F' }}>5</p>
              <p className="text-sm font-medium text-muted">Cities in Ghana</p>
            </div>
            <div className="text-center">
              <p className="font-black mb-2" style={{ fontSize: '40px', color: '#006B3F' }}>10,000+</p>
              <p className="text-sm font-medium text-muted">Bookings Made</p>
            </div>
            <div className="text-center">
              <p className="font-black mb-2" style={{ fontSize: '40px', color: '#006B3F' }}>4.8★</p>
              <p className="text-sm font-medium text-muted">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Our Story */}
      <section className="bg-white py-20">
        <div className="max-width-container px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Column - Text */}
            <div className="flex-1">
              <p className="font-bold mb-4 tracking-wider" style={{ fontSize: '12px', color: '#006B3F', textTransform: 'uppercase' }}>
                OUR STORY
              </p>
              <h2 className="font-black mb-8" style={{ fontSize: '36px', color: '#1A1A1A' }}>
                Born from frustration, built with purpose.
              </h2>
              
              <div className="space-y-6" style={{ fontSize: '15px', color: '#4B5563', lineHeight: '1.8' }}>
                <p>
                  Finding a good barber in Accra shouldn't feel like a guessing game. For years, Ghanaians relied on word-of-mouth, WhatsApp referrals, and luck — showing up to shops with no idea of wait times, pricing, or quality.
                </p>
                <p>
                  TrimConnect GH was founded to change that. We built a platform where artisans can showcase their work, set their own schedules, and accept bookings — all from their phone. And where customers can browse, compare, and book in minutes.
                </p>
                <p>
                  We're proud to be 100% Ghanaian — built in Accra, designed for our cities, and integrated with MoMo so everyone can pay the way they're used to.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex-1 relative">
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=380&fit=crop"
                alt="Barbershop interior"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4" style={{ padding: '14px 18px' }}>
                <p className="font-bold mb-1 flex items-center gap-2" style={{ fontSize: '13px', color: '#1A1A1A' }}><IconScissors className="w-4 h-4" /> Est. 2024</p>
                <p className="text-muted flex items-center gap-2" style={{ fontSize: '12px' }}>Accra, Ghana <IconFlag className="w-4 h-4" /></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - How It Works */}
      <section className="py-20" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="max-width-container px-4">
          <p className="font-bold mb-4 tracking-wider text-center" style={{ fontSize: '12px', color: '#006B3F', textTransform: 'uppercase' }}>
            HOW IT WORKS
          </p>
          <h2 className="font-black text-center mb-16" style={{ fontSize: '36px', color: '#1A1A1A' }}>
            Simple for customers. Powerful for artisans.
          </h2>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* For Customers */}
            <div className="flex-1">
              <h3 className="font-bold mb-8 flex items-center gap-2" style={{ fontSize: '20px', color: '#1A1A1A' }}>
                <IconUser className="w-6 h-6" /> For Customers
              </h3>
              
              <div className="space-y-6">
                {[
                  { num: 1, title: 'Create your account', desc: 'Sign up in under 2 minutes with just your phone number.' },
                  { num: 2, title: 'Browse artisans', desc: 'Search by service, location, or rating. View their work gallery before deciding.' },
                  { num: 3, title: 'Book your slot', desc: 'Pick a date and time that works for you. Instant confirmation.' },
                  { num: 4, title: 'Pay with MoMo', desc: 'Secure payment with MTN MoMo, Vodafone Cash, AirtelTigo, or card.' },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#006B3F' }}>
                      {step.num}
                    </div>
                    <div>
                      <p className="font-bold mb-1" style={{ fontSize: '15px', color: '#1A1A1A' }}>{step.title}</p>
                      <p className="text-muted" style={{ fontSize: '14px' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Artisans */}
            <div className="flex-1">
              <h3 className="font-bold mb-8 flex items-center gap-2" style={{ fontSize: '20px', color: '#1A1A1A' }}>
                <IconScissors className="w-6 h-6" /> For Artisans
              </h3>
              
              <div className="space-y-6">
                {[
                  { num: 1, title: 'Build your profile', desc: 'Upload your portfolio, set your services and prices in GHS.' },
                  { num: 2, title: 'Set your schedule', desc: 'Control your availability. Block days off. Accept bookings on your terms.' },
                  { num: 3, title: 'Manage bookings', desc: 'View upcoming appointments, confirm or reschedule from your dashboard.' },
                  { num: 4, title: 'Get paid instantly', desc: 'Earnings go straight to your MoMo or bank account after every booking.' },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#FCD116', color: '#1A1A1A' }}>
                      {step.num}
                    </div>
                    <div>
                      <p className="font-bold mb-1" style={{ fontSize: '15px', color: '#1A1A1A' }}>{step.title}</p>
                      <p className="text-muted" style={{ fontSize: '14px' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 - Our Values */}
      <section className="bg-white py-20">
        <div className="max-width-container px-4">
          <p className="font-bold mb-4 tracking-wider text-center" style={{ fontSize: '12px', color: '#006B3F', textTransform: 'uppercase' }}>
            WHAT WE STAND FOR
          </p>
          <h2 className="font-black text-center mb-16" style={{ fontSize: '36px', color: '#1A1A1A' }}>
            Our values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <IconUsers className="w-10 h-10" />, title: 'Trust First', desc: 'Every artisan on TrimConnect GH is verified. Every review is real. We protect customers and artisans equally.' },
              { icon: <IconFlag className="w-10 h-10" />, title: 'Built for Ghana', desc: 'From MoMo payments to local city support, every feature is designed around how Ghanaians live and work.' },
              { icon: <IconBriefcase className="w-10 h-10" />, title: 'Artisan Empowerment', desc: 'We believe skilled hands deserve a modern platform. We give artisans the tools to run a real business.' },
              { icon: <IconDeviceMobile className="w-10 h-10" />, title: 'Simple by Design', desc: "No complicated logins. No confusing menus. If your grandmother can't use it, we redesign it." },
              { icon: <IconCreditCard className="w-10 h-10" />, title: 'Transparent Pricing', desc: 'No hidden fees. Artisans see exactly what they earn. Customers see exactly what they pay.' },
              { icon: <IconRocket className="w-10 h-10" />, title: 'Always Improving', desc: 'We ship updates every week based on feedback from real barbers and customers across Ghana.' },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 transition-all hover:shadow-lg"
                style={{ border: '1px solid #F0F0F0' }}
              >
                <div className="mb-4" style={{ color: '#006B3F' }}>{value.icon}</div>
                <h3 className="font-bold mb-3" style={{ fontSize: '18px', color: '#1A1A1A' }}>{value.title}</h3>
                <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.7' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 - Meet the Team */}
      <section className="py-20" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="max-width-container px-4">
          <p className="font-bold mb-4 tracking-wider text-center" style={{ fontSize: '12px', color: '#006B3F', textTransform: 'uppercase' }}>
            THE TEAM
          </p>
          <h2 className="font-black text-center mb-16" style={{ fontSize: '36px', color: '#1A1A1A' }}>
            Built by Ghanaians, for Ghanaians.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Kofi Asante', role: 'Co-Founder & CEO', bio: 'Former barber turned tech entrepreneur. Kofi built TrimConnect GH after spending years trying to grow his Accra barbershop with just WhatsApp.', img: 10 },
              { name: 'Ama Boateng', role: 'Co-Founder & Design Lead', bio: 'UX designer obsessed with making technology accessible to every Ghanaian regardless of tech experience.', img: 11 },
              { name: 'Kwame Osei', role: 'Head of Engineering', bio: 'Full-stack developer from Kumasi. Kwame leads the team that keeps TrimConnect GH fast, reliable, and secure.', img: 12 },
              { name: 'Akosua Mensah', role: 'Head of Artisan Success', bio: 'Former hair dresser who now helps onboard and support artisans across all 5 cities.', img: 13 },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-7 text-center transition-all hover:shadow-lg"
                style={{ border: '1px solid #F0F0F0' }}
              >
                <img
                  src={`https://i.pravatar.cc/150?img=${member.img}`}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3"
                  style={{ border: '3px solid #006B3F' }}
                />
                <h3 className="font-bold mb-1" style={{ fontSize: '16px', color: '#1A1A1A', marginTop: '12px' }}>{member.name}</h3>
                <p className="font-semibold mb-3" style={{ fontSize: '13px', color: '#006B3F' }}>{member.role}</p>
                <p className="text-muted" style={{ fontSize: '13px' }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 - Final CTA */}
      <section className="py-20 text-center" style={{ background: 'linear-gradient(135deg, #006B3F, #004D2C)' }}>
        <div className="max-width-container px-4">
          <h2 className="font-black text-white mb-6" style={{ fontSize: '40px' }}>
            Ready to join the movement?
          </h2>
          <p className="text-white mb-10 mx-auto" style={{ fontSize: '17px', maxWidth: '500px', opacity: '0.7' }}>
            Whether you're looking for a fresh cut or ready to grow your clientele — TrimConnect GH is for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold h-[52px] rounded-[10px] px-8 transition-all hover:shadow-lg hover:scale-105"
              style={{ color: '#006B3F' }}
            >
              Book a trim <IconArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 font-bold h-[52px] rounded-[10px] px-8 transition-all hover:bg-white/10"
              style={{ backgroundColor: 'transparent', border: '2px solid white', color: 'white' }}
            >
              Join as Artisan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
