const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("CRITICAL ERROR: MONGODB_URI environment variable is not set!");
    console.error("Please add MONGODB_URI to your Render environment variables.");
}

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/kammahostel', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
    seedDatabase();
}).catch(err => {
    console.error('Failed to connect to MongoDB Atlas', err);
});

// --- SCHEMAS ---

const adminUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    course: { type: String, required: true },
    branch: { type: String, default: '' },
    yearOfStudy: { type: String, default: '' },
    college: { type: String, default: '' },
    contactNumber: { type: String, default: '' },
    academicYear: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});
// map _id to id
studentSchema.set('toJSON', { virtuals: true });
const Student = mongoose.model('Student', studentSchema);

const admissionSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    dob: { type: String, required: true },
    fatherName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    course: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    created_at: { type: Date, default: Date.now }
});
admissionSchema.set('toJSON', { virtuals: true });
const Admission = mongoose.model('Admission', admissionSchema);

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});
messageSchema.set('toJSON', { virtuals: true });
const Message = mongoose.model('Message', messageSchema);

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: null }
});
eventSchema.set('toJSON', { virtuals: true });
const Event = mongoose.model('Event', eventSchema);

const pageSchema = new mongoose.Schema({
    page_name: { type: String, required: true, unique: true },
    content: { type: String, required: true }
});
const Page = mongoose.model('Page', pageSchema);

// --- SEEDING LOGIC ---

async function seedDatabase() {
    try {
        // Seed Admin User
        const adminCount = await AdminUser.countDocuments({ username: 'admin' });
        if (adminCount === 0) {
            const hash = await bcrypt.hash("admin123", 10);
            await AdminUser.create({ username: 'admin', password: hash });
            console.log("Default admin account created.");
        }

        // Seed Default Pages
        const initialPages = [
            {
                name: 'home',
                content: JSON.stringify({
                    welcomeTitle: 'Welcome to Kamma Vidyarthi Sahaya Sangam',
                    welcomeSubtitle: 'Providing a premium, nurturing environment for students since 1910.',
                    aboutTitle: 'About KVSS',
                    aboutText: 'Kamma Vidyarthi Sahaya Sangam (KVSS) has been a beacon of hope and support for students for over a century. Our mission is to provide an environment where students can focus entirely on their academic and personal growth, without worrying about basic necessities. We believe in holistic development, fostering not just academic excellence but also moral values and social responsibility.'
                })
            },
            {
                name: 'history',
                content: JSON.stringify({
                    title: 'Our Glorious History',
                    subtitle: 'Over a Century of Service to Students',
                    timeline: [
                        { year: '1910', event: 'The inception of Kamma Vidyarthi Sahaya Sangam with a vision to support students in need.' },
                        { year: '1945', event: 'Expanded facilities to accommodate more students and introduced new academic support programs.' },
                        { year: '1980', event: 'Modernized the hostel infrastructure, adding better amenities for a comfortable stay.' },
                        { year: '2010', event: 'Celebrated the Centenary year, marking 100 years of unwavering commitment to student welfare.' },
                        { year: '2023', event: 'Completed major renovations and introduced digital learning resources in the library.' }
                    ]
                })
            },
            {
                name: 'hostel',
                content: JSON.stringify({
                    title: 'Boys Hostel Facilities',
                    subtitle: 'A Home Away From Home',
                    facilitiesText: 'Our boys hostel provides a safe, comfortable, and conducive environment for academic pursuits. We understand that a peaceful living space is crucial for student success.',
                    features: [
                        { title: 'Spacious Rooms', desc: 'Well-ventilated and naturally lit rooms designed for comfortable living and studying.' },
                        { title: 'Nutritious Food', desc: 'Hygienic and balanced meals prepared in our modern kitchen facility.' },
                        { title: '24/7 Security', desc: 'Round-the-clock security personnel and CCTV surveillance for complete safety.' },
                        { title: 'Library & Reading Room', desc: 'Quiet spaces equipped with essential reference books and daily newspapers.' },
                        { title: 'Recreation', desc: 'Indoor games and a TV room for relaxation during leisure time.' },
                        { title: 'Medical Assistance', desc: 'Tie-ups with local hospitals for immediate medical attention when needed.' }
                    ]
                })
            },
            {
                name: 'donate',
                content: JSON.stringify({
                    title: 'Support Our Cause',
                    subtitle: 'Your contribution helps us shape the future',
                    intro: 'Kamma Vidyarthi Sahaya Sangam runs primarily on the generous donations of philanthropists and alumni. Your contribution directly impacts the lives of deserving students by providing them with food, shelter, and educational support.',
                    bankDetails: {
                        name: 'KVSS Trust Account',
                        accountNumber: '12345678901234',
                        ifsc: 'SBIN0001234',
                        branch: 'Governorpet Branch, Vijayawada'
                    }
                })
            },
            {
                name: 'gallery',
                content: JSON.stringify({
                    title: 'Photo Gallery',
                    subtitle: 'Glimpses of our hostels, events, and activities.',
                    images: [
                        "https://via.placeholder.com/400x300?text=Hostel+Building",
                        "https://via.placeholder.com/400x300?text=Dining+Hall",
                        "https://via.placeholder.com/400x300?text=Library",
                        "https://via.placeholder.com/400x300?text=Sports+Event",
                        "https://via.placeholder.com/400x300?text=Annual+Day",
                        "https://via.placeholder.com/400x300?text=Student+Room"
                    ]
                })
            },
            {
                name: 'contact',
                content: JSON.stringify({
                    title: 'Contact Us',
                    subtitle: 'Get in touch with us for any inquiries, admissions, or donations.',
                    address: 'D.No. 27-12-75, Gandikota Complex, Prakasam Road, Governorpet, Vijayawada - 520 002.',
                    phone: '2577606',
                    email: 'kvssvja1910@gmail.com',
                    formTitle: 'Send us a Message'
                })
            },
            {
                name: 'past-presidents',
                content: JSON.stringify({
                    title: 'Past Presidents & Secretaries',
                    subtitle: 'Honoring those who led us through the years.',
                    profiles: [
                        { name: 'Dr. Example President', role: 'President (1990-2000)', bio: 'Led the organization through significant growth and established many core programs.', image: 'https://via.placeholder.com/150' }
                    ]
                })
            },
            {
                name: 'founders',
                content: JSON.stringify({
                    title: 'Founders',
                    subtitle: 'The visionary leaders who started it all.',
                    profiles: [
                        { name: 'Sri Founder Name', role: 'Founder Member', bio: 'A visionary leader who laid the foundation stone for the organization.', image: 'https://via.placeholder.com/150' }
                    ]
                })
            },
            {
                name: 'governing-body',
                content: JSON.stringify({
                    title: 'Governing Body',
                    subtitle: 'The current leadership guiding our institution.',
                    profiles: [
                        { name: 'Current President', role: 'President', bio: 'Guiding the organization towards a brighter future.', image: 'https://via.placeholder.com/150' }
                    ]
                })
            },
            {
                name: 'management-committee',
                content: JSON.stringify({
                    title: 'Management Committee',
                    subtitle: 'The dedicated members managing our daily operations.',
                    profiles: [
                        { name: 'Honorary President', role: 'Honorary President', bio: 'A visionary leader with decades of experience.\n\nHe has guided the institution through many milestones.', image: '' },
                        { name: 'President', role: 'President', bio: 'Dedicated to the ongoing success of the hostel.', image: '' },
                        { name: 'Secretary', role: 'Secretary', bio: 'Managing daily affairs with precision and care.', image: '' }
                    ]
                })
            }
        ];

        for (const page of initialPages) {
            const pageCount = await Page.countDocuments({ page_name: page.name });
            if (pageCount === 0) {
                await Page.create({ page_name: page.name, content: page.content });
            }
        }
    } catch (err) {
        console.error("Error seeding database:", err);
    }
}

module.exports = {
    AdminUser,
    Student,
    Admission,
    Message,
    Event,
    Page
};
