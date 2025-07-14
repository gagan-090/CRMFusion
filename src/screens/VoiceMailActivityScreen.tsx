import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Animated,
    Easing,
    Dimensions,
    PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const sidebarWidth = 200;
const contactsPanelWidth = 260;
const contactsModalHeight = screenHeight / 2;

const dummyContacts = [
    { id: '1', name: 'Barbara Gordon', initials: 'BG', selected: true, image: require('../assets/barbara.jpg') },
    { id: '2', name: 'Pepper Potts', initials: 'PP', image: require('../assets/pepper.jpg') },
    { id: '3', name: 'Carol Danvers', initials: 'CD', image: require('../assets/carol.jpg') },
    { id: '4', name: 'Scott Lang', initials: 'SL' },
    { id: '5', name: 'Natasha Romanoff', initials: 'NR', image: require('../assets/natasha.jpg') },
    { id: '6', name: 'Peter Parker', initials: 'PP', image: require('../assets/peter.jpg') },
    { id: '7', name: 'Barbara Gordon', initials: 'BG' },
    { id: '8', name: 'Paula Irving', initials: 'PI' },
    { id: '9', name: 'Harleen Quinzel', initials: 'HQ' },
    { id: '10', name: 'Lois Lane', initials: 'LL' },
    { id: '11', name: 'Tony Stark', initials: 'TS', image: require('../assets/tony.jpg') },
    { id: '12', name: 'Diana Prince', initials: 'DP' },
    { id: '13', name: 'Karen Starr', initials: 'KS' },
];

const voicemailData = [
    {
        id: '1',
        message: 'Barbara wishes you a happy birthday and would like to meet for lunch.',
        time: '0:00',
        hour: '8:24',
        status: 'Ongoing',
        emoji: '😊',
        date: '12:34 Today',
        mood: 'Cheerful',
    },
    {
        id: '2',
        message: 'Barbara would like you to call her back at your earliest convenience.',
        time: '0:00',
        hour: '8:24',
        status: 'Completed',
        emoji: '😐',
        date: '12:34 Today',
        mood: 'Neutral',
    },
    {
        id: '3',
        message: 'Barbara wishes you to call her back for lunch.',
        time: '0:00',
        hour: '8:24',
        status: 'Completed',
        emoji: '😊',
        date: '12:34 Today',
        mood: 'Cheerful',
    },
    {
        id: '4',
        message: 'Barbara would like you to call her back at your earliest convenience.',
        time: '0:00',
        hour: '8:24',
        status: 'Completed',
        emoji: '😔',
        date: '12:34 Today',
        mood: 'Upset',
    },
];

type TabType = 'Voicemails' | 'Tasks' | 'Notes' | 'Users' | 'Settings' | 'Help';

const getStatusTagStyle = (status: string) => {
    let backgroundColor;
    let textColor = '#fff';
    switch (status) {
        case 'Completed':
            backgroundColor = '#28a745';
            break;
        case 'Ongoing':
            backgroundColor = '#ffc107';
            textColor = '#333';
            break;
        default:
            backgroundColor = '#6c757d';
    }
    return {
        backgroundColor,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 10,
        color: textColor,
    };
};

interface ContactPanelModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelectContact: (contactId: string) => void;
    selectedContactId: string;
}

const ContactPanelModal: React.FC<ContactPanelModalProps> = ({ isVisible, onClose, onSelectContact, selectedContactId }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const _initialTouchOffset = useRef({ x: 0, y: 0 });

    const initialX = sidebarWidth + (screenWidth - sidebarWidth - contactsPanelWidth) / 2;
    const initialY = (screenHeight - contactsModalHeight) / 2;

    const [shouldRender, setShouldRender] = useState(false); // New state for conditional rendering

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true); // Mount the component
            // Set initial position if it's the first time or reset
            if (pan.x.__getValue() === 0 && pan.y.__getValue() === 0) {
                 pan.setValue({ x: initialX, y: initialY });
            }

            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start(() => {
                setShouldRender(false); // Unmount after animation completes
                // Reset position after unmounting to ensure clean state for next open
                pan.setValue({ x: initialX, y: initialY });
                _initialTouchOffset.current = { x: 0, y: 0 };
            });
        }
    }, [isVisible, opacity, pan]); // Added pan to dependencies

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e, gestureState) => {
            _initialTouchOffset.current = {
                x: gestureState.x0 - pan.x.__getValue(),
                y: gestureState.y0 - pan.y.__getValue(),
            };

            pan.setOffset({ x: pan.x.__getValue(), y: pan.y.__getValue() });
            pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event(
            [
                null,
                { dx: pan.x, dy: pan.y }
            ],
            { useNativeDriver: false }
        ),
        onPanResponderRelease: (e, gestureState) => {
            pan.flattenOffset();
            _initialTouchOffset.current = { x: 0, y: 0 };
        },
    }), [pan]); // Memoize panResponder to prevent recreation on every render

    if (!shouldRender) return null; // Only render if shouldRender is true

    return (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: opacity, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 99 }]}>
            {/* The TouchableOpacity covers the whole screen to dismiss on blank click */}
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

            <Animated.View
                style={[
                    styles.contactsPanelModal,
                    {
                        transform: [
                            { translateX: Animated.add(pan.x, Animated.multiply(-1, _initialTouchOffset.current.x)) },
                            { translateY: Animated.add(pan.y, Animated.multiply(-1, _initialTouchOffset.current.y)) },
                        ],
                    }
                ]}
                {...panResponder.panHandlers}
            >
                <View style={styles.contactsHeader}>
                    <Text style={styles.contactsTitle}>Contacts</Text>
                    <TouchableOpacity style={styles.newBtn}>
                        <Icon name="plus" color="#fff" size={16} style={{ marginRight: 4 }} />
                        <Text style={styles.newBtnText}>New</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.searchInputContainer}>
                    <Icon name="magnify" size={20} color="#aaa" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search"
                        style={styles.searchInput}
                        placeholderTextColor="#aaa"
                    />
                </View>
                <ScrollView contentContainerStyle={styles.contactsListScrollView}>
                    {dummyContacts.map((c) => (
                        <TouchableOpacity
                            key={c.id}
                            style={[
                                styles.contactRow,
                                selectedContactId === c.id && styles.selectedContactRow,
                            ]}
                            onPress={() => {
                                onSelectContact(c.id);
                                onClose();
                            }}
                        >
                            <View style={styles.contactCircle}>
                                {c.image ? (
                                    <Image source={c.image} style={styles.contactImage} />
                                ) : (
                                    <Text style={styles.initials}>{c.initials}</Text>
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.contactName,
                                    selectedContactId === c.id && styles.selectedContactName,
                                ]}
                            >
                                {c.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>
        </Animated.View>
    );
};

// ... (rest of VoiceMailActivityScreen and styles remain the same) ...
const VoiceMailActivityScreen = () => {
    const [showContactsModal, setShowContactsModal] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('Voicemails');
    const [selectedContactId, setSelectedContactId] = useState('1');

    const handleOpenContacts = () => {
        setShowContactsModal(true);
    };

    const handleCloseContacts = () => {
        setShowContactsModal(false);
    };

    const handleContactSelection = (contactId: string) => {
        setSelectedContactId(contactId);
    };

    return (
        <View style={styles.container}>
            <View style={styles.sidebar}>
                <View style={styles.profile}>
                    <Image source={require('../assets/avatar.jpg')} style={styles.avatar} />
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userName}>Sarah Johnson</Text>
                </View>

                <View style={styles.menu}>
                    <SidebarItem
                        icon="headphones"
                        label="Voicemails"
                        count={2}
                        active={activeTab === 'Voicemails'}
                        onPress={() => {
                            setActiveTab('Voicemails');
                        }}
                    />
                    <SidebarItem
                        icon="account"
                        label="Contacts"
                        onPress={handleOpenContacts}
                        active={showContactsModal}
                    />
                    <SidebarItem
                        icon="clipboard-text"
                        label="Tasks"
                        count={1}
                        active={activeTab === 'Tasks'}
                        onPress={() => {
                            setActiveTab('Tasks');
                        }}
                    />
                    <SidebarItem
                        icon="account-group"
                        label="Users"
                        active={activeTab === 'Users'}
                        onPress={() => setActiveTab('Users')}
                    />
                    <SidebarItem
                        icon="cog"
                        label="Settings"
                        active={activeTab === 'Settings'}
                        onPress={() => setActiveTab('Settings')}
                    />
                    <SidebarItem
                        icon="help-circle"
                        label="Help"
                        active={activeTab === 'Help'}
                        onPress={() => setActiveTab('Help')}
                    />
                </View>

                <TouchableOpacity style={styles.logout}>
                    <Icon name="logout" size={20} color="#888" style={{ marginRight: 6 }} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mainContent}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.mainName}>Barbara Gordon</Text>
                        <Text style={styles.mainNumber}>(704) 555-0127</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Icon name="pencil-outline" size={20} color="#666" style={{ marginRight: 15 }} />
                        <TouchableOpacity style={styles.callNowBtn}>
                            <Icon name="phone" color="#fff" size={16} style={{ marginRight: 6 }} />
                            <Text style={styles.callNowText}>Call Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.details}>
                    <DetailItem icon="email" text="Barbara@example.com" />
                    <DetailItem icon="map-marker" text="Lavender street, Mountain View, USA" />
                    <DetailItem icon="tag" text="Sales, Upgrade, Outreach" />
                </View>

                <View style={styles.tabs}>
                    {(['Voicemails', 'Tasks', 'Notes'] as TabType[]).map((tab) => (
                        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.activeTab,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView contentContainerStyle={styles.voicemailScrollView}>
                    {activeTab === 'Voicemails' && voicemailData.map((v) => (
                        <View key={v.id} style={styles.voicemailRow}>
                            <Icon name="play" size={24} color="#888" style={{ marginRight: 10 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.voicemailMsg}>{v.message}</Text>
                                <Text style={styles.voicemailSub}>
                                    {v.date} • {v.mood} {v.emoji}
                                </Text>
                            </View>
                            <View style={getStatusTagStyle(v.status)}>
                                <Text style={{ color: getStatusTagStyle(v.status).color, fontSize: 11, fontWeight: 'bold' }}>{v.status}</Text>
                            </View>
                        </View>
                    ))}
                    {activeTab === 'Tasks' && (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No tasks for this contact.</Text>
                        </View>
                    )}
                    {activeTab === 'Notes' && (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No notes for this contact.</Text>
                        </View>
                    )}
                    {(activeTab === 'Users' || activeTab === 'Settings' || activeTab === 'Help') && (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>{activeTab} content goes here.</Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            <ContactPanelModal
                isVisible={showContactsModal}
                onClose={handleCloseContacts}
                onSelectContact={handleContactSelection}
                selectedContactId={selectedContactId}
            />
        </View>
    );
};

interface SidebarItemProps {
    icon: string;
    label: string;
    count?: number;
    active?: boolean;
    onPress?: () => void;
}

const SidebarItem = ({ icon, label, count, active, onPress }: SidebarItemProps) => (
    <TouchableOpacity style={[styles.menuItem, active && styles.activeMenu]} onPress={onPress}>
        <Icon name={icon} size={20} color={active ? '#d32f2f' : '#666'} style={{ marginRight: 15 }} />
        <Text style={[styles.menuText, active && styles.activeMenuText]}>{label}</Text>
        {count ? <View style={styles.countBubble}><Text style={styles.countText}>{count}</Text></View> : null}
    </TouchableOpacity>
);

interface DetailItemProps {
    icon: string;
    text: string;
}

const DetailItem = ({ icon, text }: DetailItemProps) => (
    <View style={styles.detailRow}>
        <Icon name={icon} size={20} color="#666" style={{ marginRight: 8 }} />
        <Text style={styles.detailText}>{text}</Text>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        fontFamily: 'Inter',
    },
    sidebar: {
        width: sidebarWidth,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'flex-start',
        elevation: 2,
        zIndex: 10,
    },
    profile: {
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
        alignSelf: 'center',
    },
    welcomeText: {
        fontSize: 12,
        color: '#888',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    menu: {
        width: '100%',
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingLeft: 20,
    },
    activeMenu: {
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        marginLeft: 10,
        width: 'auto',
    },
    activeMenuText: {
        color: '#d32f2f',
        fontWeight: 'bold',
    },
    menuText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    countBubble: {
        backgroundColor: '#28a745',
        borderRadius: 12,
        paddingHorizontal: 7,
        paddingVertical: 2,
        marginLeft: 'auto',
        marginRight: 10,
    },
    countText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 'auto',
        width: '100%',
    },
    logoutText: {
        marginLeft: 6,
        color: '#888',
        fontSize: 12,
    },

    contactsPanelModal: {
        position: 'absolute',
        width: contactsPanelWidth,
        height: contactsModalHeight,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        elevation: 10,
    },
    contactsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    contactsTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333',
    },
    newBtn: {
        flexDirection: 'row',
        backgroundColor: '#dc3545',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    newBtnText: {
        color: '#fff',
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '600',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 14,
        color: '#333',
    },
    contactsListScrollView: {
        paddingBottom: 20,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 8,
        marginBottom: 5,
    },
    selectedContactRow: {
        backgroundColor: '#dc3545',
    },
    contactCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    initials: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 16,
    },
    contactImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contactName: {
        fontSize: 15,
        color: '#333',
        flex: 1,
    },
    selectedContactName: {
        color: '#fff',
    },
    mainContent: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        zIndex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    mainName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    mainNumber: {
        fontSize: 16,
        color: '#666',
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    callNowBtn: {
        flexDirection: 'row',
        backgroundColor: '#28a745',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    callNowText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },

    details: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        elevation: 1,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 15,
        color: '#333',
    },

    tabs: {
        flexDirection: 'row',
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 15,
    },
    tabText: {
        marginRight: 25,
        paddingBottom: 8,
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
    },
    activeTab: {
        color: '#dc3545',
        borderBottomWidth: 2,
        borderBottomColor: '#dc3545',
    },

    voicemailScrollView: {
        paddingBottom: 20,
    },
    voicemailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
        paddingHorizontal: 15,
    },
    voicemailMsg: {
        fontWeight: '500',
        fontSize: 14,
        color: '#333',
    },
    voicemailSub: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    noDataText: {
        fontSize: 16,
        color: '#888',
    },
});

export default VoiceMailActivityScreen;