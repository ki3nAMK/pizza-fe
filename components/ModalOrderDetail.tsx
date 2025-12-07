import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

type OrderItem = {
    name: string;
    quantity: number;
    price: number;
    image_url: string;
};

type ModalOrderDetailProps = {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    orderItems?: OrderItem[];
};

export default function ModalOrderDetail({ modalVisible, setModalVisible, orderItems = [] }: ModalOrderDetailProps) {
    const total = orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Order Details</Text>

                    <ScrollView style={{ maxHeight: 300 }}>
                        {orderItems.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <Image source={{ uri: item.image_url }} style={styles.itemImage} />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.modalText}>{item.name}</Text>
                                    <Text style={styles.modalText}>
                                        {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <Text style={[styles.modalText, { fontWeight: '700', marginTop: 8 }]}>
                        Total: ${total.toFixed(2)}
                    </Text>

                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <View style={[styles.btnPrimary, { marginTop: 16 }]}>
                            <Text style={styles.btnPrimaryText}>Close</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 4,
    },
    btnPrimary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: '#F82E08',
        borderColor: '#F82E08',
    },
    btnPrimaryText: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '700',
        color: '#fff',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        resizeMode: 'cover',
    },
});
