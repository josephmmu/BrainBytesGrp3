const axios = require('axios');
const { faker } = require('@faker-js/faker');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const SIMULATION_DURATION = parseInt(process.env.SIMULATION_DURATION) || 300; // 5 minutes
const CONCURRENT_USERS = parseInt(process.env.CONCURRENT_USERS) || 10;
const REQUEST_INTERVAL = 5000; // 5 seconds between requests

// Filipino educational subjects
const FILIPINO_SUBJECTS = [
    'Mathematics', 'Science', 'English', 'Filipino', 'History',
    'Geography', 'Araling Panlipunan', 'GMRC', 'Music', 'Arts',
    'Physical Education', 'Technology and Livelihood Education'
];

// Sample Filipino user data
const FILIPINO_USERS = [
    { email: 'juan.delacruz@gmail.com', password: 'password123', name: 'Juan Dela Cruz' },
    { email: 'maria.santos@gmail.com', password: 'password123', name: 'Maria Santos' },
    { email: 'jose.rizal@gmail.com', password: 'password123', name: 'Jose Rizal' },
    { email: 'ana.garcia@gmail.com', password: 'password123', name: 'Ana Garcia' },
    { email: 'pedro.martinez@gmail.com', password: 'password123', name: 'Pedro Martinez' }
];

// Sample Filipino chat messages
const FILIPINO_QUESTIONS = [
    'Paano ko masosolve ang quadratic equation?',
    'Ano ang photosynthesis?',
    'Explain ang water cycle',
    'Paano ginawa ang Rizal Law?',
    'What is the capital of Luzon?',
    'Ano ang mga dahilan ng climate change?',
    'Paano mag-compute ng percentage?',
    'Explain ang solar system',
    'Ano ang mga elemento ng periodic table?',
    'Paano gumawa ng essay?'
];

// Device types common in Philippines
const DEVICE_TYPES = [
    'mobile', 'mobile', 'mobile', 'mobile', 'mobile', // 70% mobile
    'desktop', 'desktop', 'tablet' // 30% desktop/tablet
];

// Connection types in Philippines
const CONNECTION_TYPES = [
    'mobile_data', 'mobile_data', 'mobile_data', 'mobile_data', // 60% mobile data
    'wifi', 'wifi', 'wifi' // 40% wifi
];

// Regions in Philippines
const REGIONS = [
    'metro_manila', 'metro_manila', 'metro_manila', // 40% Metro Manila
    'cebu', 'davao', 'baguio', 'iloilo', 'cagayan_de_oro', 'zamboanga', 'provinces'
];

class BrainBytesSimulator {
    constructor() {
        this.users = [];
        this.activeUsers = [];
        this.isRunning = false;
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            totalUsers: 0,
            totalMessages: 0,
            totalLogins: 0
        };
    }

    // Generate realistic user agents for Filipino users
    generateUserAgent(deviceType, region) {
        const commonPhones = [
            'Samsung Galaxy A12', 'Samsung Galaxy A32', 'Oppo A96',
            'Vivo Y33s', 'Realme 9i', 'Xiaomi Redmi Note 11'
        ];
        
        if (deviceType === 'mobile') {
            const phone = faker.helpers.arrayElement(commonPhones);
            return `Mozilla/5.0 (Linux; Android 11; ${phone}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36`;
        } else {
            return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36`;
        }
    }

    // Simulate network conditions based on Filipino internet infrastructure
    getNetworkDelay(region, connectionType) {
        let baseDelay = 100; // Base delay in ms
        
        // Regional variations
        if (region === 'metro_manila') {
            baseDelay = 50;
        } else if (region === 'cebu' || region === 'davao') {
            baseDelay = 75;
        } else {
            baseDelay = 150; // Provincial areas
        }
        
        // Connection type variations
        if (connectionType === 'mobile_data') {
            baseDelay += faker.number.int({ min: 50, max: 200 });
        } else {
            baseDelay += faker.number.int({ min: 10, max: 50 });
        }
        
        return baseDelay;
    }

    // Create axios instance with simulated Filipino user characteristics
    createAxiosInstance(deviceType, region, connectionType) {
        const userAgent = this.generateUserAgent(deviceType, region);
        const delay = this.getNetworkDelay(region, connectionType);
        
        return axios.create({
            baseURL: BACKEND_URL,
            timeout: 30000,
            headers: {
                'User-Agent': userAgent,
                'Accept-Language': 'en-US,en;q=0.9,fil;q=0.8,tl;q=0.7',
                'Connection': connectionType === 'mobile_data' ? 'close' : 'keep-alive'
            },
            // Simulate network delay
            transformRequest: [(data, headers) => {
                return new Promise(resolve => {
                    setTimeout(() => resolve(data), delay);
                });
            }]
        });
    }

    // Register a user
    async registerUser(userData, deviceType, region, connectionType) {
        try {
            const axiosInstance = this.createAxiosInstance(deviceType, region, connectionType);
            
            const response = await axiosInstance.post('/api/register', {
                email: userData.email,
                password: userData.password
            });
            
            this.stats.totalUsers++;
            this.stats.successfulRequests++;
            console.log(`✅ User registered: ${userData.email} (${deviceType}, ${region})`);
            
            return true;
        } catch (error) {
            this.stats.failedRequests++;
            if (error.response?.status !== 400) { // Ignore "already exists" errors
                console.log(`❌ Registration failed for ${userData.email}: ${error.message}`);
            }
            return false;
        }
    }

    // Login a user
    async loginUser(userData, deviceType, region, connectionType) {
        try {
            const axiosInstance = this.createAxiosInstance(deviceType, region, connectionType);
            
            const response = await axiosInstance.post('/api/login', {
                email: userData.email,
                password: userData.password
            });
            
            this.stats.totalLogins++;
            this.stats.successfulRequests++;
            
            return {
                token: response.data.token,
                user: response.data.user,
                axiosInstance,
                deviceType,
                region,
                connectionType
            };
        } catch (error) {
            this.stats.failedRequests++;
            console.log(`❌ Login failed for ${userData.email}: ${error.message}`);
            return null;
        }
    }

    // Send a chat message
    async sendChatMessage(userSession, message, subject) {
        try {
            const response = await userSession.axiosInstance.post('/api/messages', {
                text: message,
                subject: subject
            }, {
                headers: {
                    'Authorization': `Bearer ${userSession.token}`
                }
            });
            
            this.stats.totalMessages++;
            this.stats.successfulRequests++;
            
            console.log(`💬 Message sent by ${userSession.user.email}: "${message.substring(0, 50)}..." (${subject})`);
            return response.data;
        } catch (error) {
            this.stats.failedRequests++;
            console.log(`❌ Message failed for ${userSession.user.email}: ${error.message}`);
            return null;
        }
    }

    // Simulate a user session
    async simulateUserSession(userData) {
        const deviceType = faker.helpers.arrayElement(DEVICE_TYPES);
        const region = faker.helpers.arrayElement(REGIONS);
        const connectionType = faker.helpers.arrayElement(CONNECTION_TYPES);
        
        console.log(`🚀 Starting session for ${userData.email} (${deviceType}, ${region}, ${connectionType})`);
        
        // Register user (might fail if already exists)
        await this.registerUser(userData, deviceType, region, connectionType);
        
        // Login user
        const userSession = await this.loginUser(userData, deviceType, region, connectionType);
        if (!userSession) return;
        
        // Send multiple messages during the session
        const sessionDuration = faker.number.int({ min: 60, max: 300 }); // 1-5 minutes
        const messageCount = faker.number.int({ min: 3, max: 10 });
        
        for (let i = 0; i < messageCount && this.isRunning; i++) {
            const message = faker.helpers.arrayElement(FILIPINO_QUESTIONS);
            const subject = faker.helpers.arrayElement(FILIPINO_SUBJECTS);
            
            await this.sendChatMessage(userSession, message, subject);
            
            // Wait between messages
            const waitTime = faker.number.int({ min: 10, max: 60 }) * 1000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        console.log(`🏁 Session ended for ${userData.email}`);
    }

    // Generate additional test users
    generateTestUsers(count) {
        const users = [...FILIPINO_USERS];
        
        for (let i = 0; i < count; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = faker.internet.email(firstName, lastName, 'gmail.com');
            
            users.push({
                email,
                password: 'password123',
                name: `${firstName} ${lastName}`
            });
        }
        
        return users;
    }

    // Main simulation loop
    async start() {
        console.log('🎯 Starting BrainBytes Traffic Simulation...');
        console.log(`📊 Configuration:`);
        console.log(`   - Backend URL: ${BACKEND_URL}`);
        console.log(`   - Duration: ${SIMULATION_DURATION} seconds`);
        console.log(`   - Concurrent Users: ${CONCURRENT_USERS}`);
        console.log(`   - Request Interval: ${REQUEST_INTERVAL}ms`);
        console.log('');
        
        this.isRunning = true;
        
        // Generate test users
        const allUsers = this.generateTestUsers(CONCURRENT_USERS);
        
        // Start user sessions
        const userPromises = allUsers.slice(0, CONCURRENT_USERS).map(userData => {
            return this.simulateUserSession(userData);
        });
        
        // Run simulation for specified duration
        setTimeout(() => {
            this.isRunning = false;
            console.log('\n⏰ Simulation time ended');
        }, SIMULATION_DURATION * 1000);
        
        // Wait for all user sessions to complete
        await Promise.all(userPromises);
        
        this.printStats();
    }

    // Print simulation statistics
    printStats() {
        console.log('\n📈 Simulation Statistics:');
        console.log('========================');
        console.log(`Total Requests: ${this.stats.totalRequests}`);
        console.log(`Successful Requests: ${this.stats.successfulRequests}`);
        console.log(`Failed Requests: ${this.stats.failedRequests}`);
        console.log(`Success Rate: ${((this.stats.successfulRequests / this.stats.totalRequests) * 100).toFixed(2)}%`);
        console.log(`Total Users: ${this.stats.totalUsers}`);
        console.log(`Total Logins: ${this.stats.totalLogins}`);
        console.log(`Total Messages: ${this.stats.totalMessages}`);
        console.log('========================');
    }

    // Monitor backend health
    async monitorHealth() {
        setInterval(async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/health`);
                console.log(`💚 Backend Health: ${response.data.status} (uptime: ${Math.floor(response.data.uptime)}s)`);
            } catch (error) {
                console.log(`❤️‍🩹 Backend Health Check Failed: ${error.message}`);
            }
        }, 30000); // Check every 30 seconds
    }
}

// Main execution
if (require.main === module) {
    const simulator = new BrainBytesSimulator();
    
    // Start health monitoring
    simulator.monitorHealth();
    
    // Start simulation
    simulator.start().catch(error => {
        console.error('❌ Simulation failed:', error);
        process.exit(1);
    });
}

module.exports = BrainBytesSimulator;
