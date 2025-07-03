import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Switch,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState('');
  
  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showSellProduct, setShowSellProduct] = useState(false);
  const [showAlertDetail, setShowAlertDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsEmergency, setSmsEmergency] = useState(false);
  
  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    weight: '',
    price: '',
    quality: 'Baik',
    emoji: '🌾'
  });
  
  const [sellForm, setSellForm] = useState({
    quantity: '',
    pricePerKg: '',
    totalPrice: '0'
  });

  // Real-time sensor data
  const [sensorData, setSensorData] = useState({
    temperature: 24.5,
    humidity: 68,
    ph: 6.2,
    weight: 247.8
  });

  // Products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Cabai Merah',
      weight: '150 kg',
      price: '45.000/kg',
      quality: 'Baik',
      emoji: '🌶️',
      status: 'Siap Jual',
      description: 'Cabai merah segar dengan kualitas premium, siap untuk dipasarkan.'
    },
    {
      id: 2,
      name: 'Beras Premium',
      weight: '500 kg',
      price: '12.000/kg',
      quality: 'Sangat Baik',
      emoji: '🌾',
      status: 'Siap Jual',
      description: 'Beras premium berkualitas tinggi dengan aroma yang wangi.'
    },
    {
      id: 3,
      name: 'Jagung Pipil',
      weight: '300 kg',
      price: '6.500/kg',
      quality: 'Cukup',
      emoji: '🌽',
      status: 'Perhatian',
      description: 'Jagung pipil yang memerlukan perhatian khusus untuk penyimpanan.'
    }
  ]);

  // Alerts data
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      icon: '🚨',
      title: 'Suhu melebihi batas di Gudang B',
      time: '1 jam lalu',
      severity: 'critical',
      description: 'Suhu gudang B mencapai 35°C, melebihi batas normal 30°C. Segera lakukan pendinginan.',
      action: 'Nyalakan sistem pendingin dan periksa ventilasi gudang.',
      resolved: false
    },
    {
      id: 2,
      icon: '⚠️',
      title: 'Kelembaban tinggi di Gudang A',
      time: '10 menit lalu',
      severity: 'warning',
      description: 'Kelembaban gudang A mencapai 85%, berpotensi menyebabkan jamur pada produk.',
      action: 'Aktifkan dehumidifier dan periksa sistem drainase.',
      resolved: false
    },
    {
      id: 3,
      icon: 'ℹ️',
      title: 'Kualitas cabai merah: Baik',
      time: '25 menit lalu',
      severity: 'info',
      description: 'Hasil pemeriksaan kualitas cabai merah menunjukkan kondisi baik dan siap dipasarkan.',
      action: 'Lanjutkan monitoring rutin setiap 6 jam.',
      resolved: true
    }
  ]);

  useEffect(() => {
    // Update time
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit'
      }));
    }, 1000);

    // Simulate sensor updates
    const sensorInterval = setInterval(() => {
      setSensorData(prev => ({
        temperature: Math.max(20, Math.min(35, prev.temperature + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 2)),
        ph: Math.max(0, Math.min(14, prev.ph + (Math.random() - 0.5) * 0.1)),
        weight: Math.max(200, Math.min(300, prev.weight + (Math.random() - 0.5) * 0.5))
      }));
    }, 3000);

    // Cleanup function
    return () => {
      clearInterval(timeInterval);
      clearInterval(sensorInterval);
    };
  }, []); // Empty dependency array to run only once

  // Animation functions
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Add product function
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.weight || !newProduct.price) {
      Alert.alert('Error', 'Harap isi semua field yang diperlukan');
      return;
    }

    const product = {
      id: products.length + 1,
      name: newProduct.name,
      weight: newProduct.weight,
      price: newProduct.price,
      quality: newProduct.quality,
      emoji: newProduct.emoji,
      status: 'Siap Jual',
      description: `${newProduct.name} berkualitas ${newProduct.quality.toLowerCase()}.`
    };

    setProducts([...products, product]);
    setNewProduct({ name: '', weight: '', price: '', quality: 'Baik', emoji: '🌾' });
    setShowAddProduct(false);
    
    Alert.alert('Berhasil', 'Produk berhasil ditambahkan!');
  };

  // Calculate total price helper function
  const calculateTotal = (quantity, pricePerKg) => {
    if (quantity && pricePerKg) {
      const cleanQuantity = parseFloat(quantity.replace(/[.,]/g, '')) || 0;
      const cleanPrice = parseFloat(pricePerKg.replace(/[.,]/g, '')) || 0;
      const total = cleanQuantity * cleanPrice;
      return total.toLocaleString('id-ID');
    }
    return '0';
  };

  // Handle sell product
  const handleSellProduct = () => {
    if (!sellForm.quantity || !sellForm.pricePerKg) {
      Alert.alert('Error', 'Harap isi quantity dan harga per kg');
      return;
    }

    Alert.alert(
      'Konfirmasi Penjualan',
      `Posting ${selectedProduct.name} sebanyak ${sellForm.quantity} kg dengan harga Rp ${sellForm.pricePerKg}/kg?\n\nTotal: Rp ${sellForm.totalPrice}`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Ya, Posting', 
          onPress: () => {
            setSellForm({ quantity: '', pricePerKg: '', totalPrice: '0' });
            setShowSellProduct(false);
            Alert.alert('Berhasil', 'Produk berhasil diposting ke marketplace!');
          }
        }
      ]
    );
  };

  // Resolve alert
  const handleResolveAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    setShowAlertDetail(false);
    Alert.alert('Berhasil', 'Alert berhasil diselesaikan!');
  };

  // Status Card Component
  const StatusCard = ({ title, value, unit, color, icon, onPress }) => (
    <TouchableOpacity 
      style={[styles.statusCard, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statusHeader}>
        <Text style={styles.statusIcon}>{icon}</Text>
        <View style={[styles.statusDot, { backgroundColor: color }]} />
      </View>
      <Text style={styles.statusTitle}>{title}</Text>
      <Text style={[styles.statusValue, { color }]}>
        {value}
        <Text style={styles.statusUnit}> {unit}</Text>
      </Text>
    </TouchableOpacity>
  );

  // Quick Stat Component
  const QuickStat = ({ label, value, subtitle, gradientColors, onPress }) => (
    <TouchableOpacity style={styles.quickStatCard} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={gradientColors}
        style={styles.quickStatGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.quickStatLabel}>{label}</Text>
        <Text style={styles.quickStatValue}>{value}</Text>
        <Text style={styles.quickStatSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Product Card Component
  const ProductCard = ({ product, onDetail, onSell }) => {
    const getQualityColor = () => {
      switch(product.quality) {
        case 'Sangat Baik': return '#10B981';
        case 'Baik': return '#3B82F6';
        default: return '#F59E0B';
      }
    };

    return (
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <View>
            <Text style={styles.productEmoji}>{product.emoji}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productWeight}>{product.weight}</Text>
          </View>
          <View style={styles.productRight}>
            <Text style={styles.productPrice}>Rp {product.price}</Text>
            <View style={[styles.qualityBadge, { backgroundColor: getQualityColor() }]}>
              <Text style={styles.qualityText}>{product.quality}</Text>
            </View>
          </View>
        </View>
        <View style={styles.productActions}>
          <TouchableOpacity 
            style={styles.detailButton}
            onPress={() => onDetail(product)}
            activeOpacity={0.7}
          >
            <Text style={styles.detailButtonText}>Detail</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sellButton}
            onPress={() => onSell(product)}
            activeOpacity={0.7}
          >
            <Text style={styles.sellButtonText}>Jual</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Alert Item Component
  const AlertItem = ({ alert, onPress }) => {
    const getSeverityColor = () => {
      switch(alert.severity) {
        case 'critical': return '#EF4444';
        case 'warning': return '#F59E0B';
        default: return '#3B82F6';
      }
    };

    return (
      <TouchableOpacity 
        style={[
          styles.alertCard, 
          { 
            borderLeftColor: getSeverityColor(),
            opacity: alert.resolved ? 0.6 : 1 
          }
        ]}
        onPress={() => onPress(alert)}
        activeOpacity={0.7}
      >
        <View style={styles.alertContent}>
          <Text style={styles.alertIcon}>{alert.icon}</Text>
          <View style={styles.alertText}>
            <Text style={styles.alertTitle}>
              {alert.title}
              {alert.resolved && <Text style={styles.resolvedText}> ✅</Text>}
            </Text>
            <Text style={styles.alertTime}>{alert.time}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.alertButton, { backgroundColor: getSeverityColor() }]}>
          <Text style={styles.alertButtonText}>Lihat</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Navigation Component
  const NavButton = ({ icon, label, pageId, badge }) => (
    <TouchableOpacity 
      style={[styles.navButton, currentPage === pageId && styles.navButtonActive]}
      onPress={() => setCurrentPage(pageId)}
      activeOpacity={0.7}
    >
      <View style={styles.navIconContainer}>
        <Text style={[styles.navIcon, currentPage === pageId && styles.navIconActive]}>
          {icon}
        </Text>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.navLabel, currentPage === pageId && styles.navLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Add Product Modal
  const AddProductModal = () => (
    <Modal visible={showAddProduct} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tambah Produk Baru</Text>
          
          <View style={styles.emojiSelector}>
            {['🌶️', '🌾', '🌽', '🥕', '🍅', '🥬'].map(emoji => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.emojiOption,
                  newProduct.emoji === emoji && styles.emojiSelected
                ]}
                onPress={() => setNewProduct({...newProduct, emoji})}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nama Produk"
            value={newProduct.name}
            onChangeText={(text) => setNewProduct({...newProduct, name: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Berat (kg)"
            value={newProduct.weight}
            onChangeText={(text) => setNewProduct({...newProduct, weight: text})}
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Harga per kg"
            value={newProduct.price}
            onChangeText={(text) => setNewProduct({...newProduct, price: text})}
            keyboardType="numeric"
          />

          <View style={styles.qualitySelector}>
            <Text style={styles.qualityLabel}>Kualitas:</Text>
            {['Sangat Baik', 'Baik', 'Cukup'].map(quality => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.qualityOption,
                  newProduct.quality === quality && styles.qualitySelected
                ]}
                onPress={() => setNewProduct({...newProduct, quality})}
              >
                <Text style={[
                  styles.qualityOptionText,
                  newProduct.quality === quality && styles.qualitySelectedText
                ]}>
                  {quality}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowAddProduct(false)}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAddProduct}
            >
              <Text style={styles.saveButtonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Product Detail Modal
  const ProductDetailModal = () => (
    <Modal visible={showProductDetail} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedProduct && (
            <>
              <Text style={styles.modalTitle}>Detail Produk</Text>
              <View style={styles.productDetailContainer}>
                <Text style={styles.productDetailEmoji}>{selectedProduct.emoji}</Text>
                <Text style={styles.productDetailName}>{selectedProduct.name}</Text>
                <Text style={styles.productDetailInfo}>Berat: {selectedProduct.weight}</Text>
                <Text style={styles.productDetailInfo}>Harga: Rp {selectedProduct.price}</Text>
                <Text style={styles.productDetailInfo}>Kualitas: {selectedProduct.quality}</Text>
                <Text style={styles.productDetailInfo}>Status: {selectedProduct.status}</Text>
                <Text style={styles.productDetailDescription}>{selectedProduct.description}</Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowProductDetail(false)}
                >
                  <Text style={styles.cancelButtonText}>Tutup</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => {
                    setShowProductDetail(false);
                    setTimeout(() => {
                      setShowSellProduct(true);
                    }, 300);
                  }}
                >
                  <Text style={styles.saveButtonText}>Jual Produk</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // Sell Product Modal
  const SellProductModal = () => (
    <Modal visible={showSellProduct} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedProduct && (
            <>
              <Text style={styles.modalTitle}>Jual {selectedProduct.name}</Text>
              
              <View style={styles.sellSummary}>
                <Text style={styles.sellProductName}>{selectedProduct.emoji} {selectedProduct.name}</Text>
                <Text style={styles.sellAvailable}>Tersedia: {selectedProduct.weight}</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Quantity yang dijual (kg)"
                value={sellForm.quantity}
                onChangeText={(text) => setSellForm(prev => ({
                  ...prev, 
                  quantity: text,
                  totalPrice: calculateTotal(text, prev.pricePerKg)
                }))}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Harga per kg"
                value={sellForm.pricePerKg}
                onChangeText={(text) => setSellForm(prev => ({
                  ...prev, 
                  pricePerKg: text,
                  totalPrice: calculateTotal(prev.quantity, text)
                }))}
                keyboardType="numeric"
              />

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Harga:</Text>
                <Text style={styles.totalValue}>Rp {sellForm.totalPrice}</Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowSellProduct(false)}
                >
                  <Text style={styles.cancelButtonText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSellProduct}
                >
                  <Text style={styles.saveButtonText}>Posting ke Pasar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // Alert Detail Modal
  const AlertDetailModal = () => (
    <Modal visible={showAlertDetail} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedAlert && (
            <>
              <Text style={styles.modalTitle}>Detail Peringatan</Text>
              
              <View style={styles.alertDetailContainer}>
                <Text style={styles.alertDetailIcon}>{selectedAlert.icon}</Text>
                <Text style={styles.alertDetailTitle}>{selectedAlert.title}</Text>
                <Text style={styles.alertDetailTime}>{selectedAlert.time}</Text>
                <Text style={styles.alertDetailDescription}>{selectedAlert.description}</Text>
                <Text style={styles.alertDetailAction}>Tindakan: {selectedAlert.action}</Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowAlertDetail(false)}
                >
                  <Text style={styles.cancelButtonText}>Tutup</Text>
                </TouchableOpacity>
                {!selectedAlert.resolved && (
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={() => handleResolveAlert(selectedAlert.id)}
                  >
                    <Text style={styles.saveButtonText}>Tandai Selesai</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // Dashboard Page
  const renderDashboard = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Farm Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.farmHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.farmInfo}>
          <Text style={styles.farmName}>UMKM Berkah Tani</Text>
          <Text style={styles.farmLocation}>📍 Balikpapan, Kaltim</Text>
        </View>
        <View style={styles.farmStatus}>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
          <Text style={styles.currentTime}>{currentTime}</Text>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.quickStatsContainer}>
        <QuickStat 
          label="Total Produk"
          value="950 kg"
          subtitle="3 Komoditas"
          gradientColors={['#3B82F6', '#1D4ED8']}
          onPress={() => setCurrentPage('products')}
        />
        <QuickStat 
          label="Kualitas"
          value="8.5/10"
          subtitle="Sangat Baik"
          gradientColors={['#F59E0B', '#D97706']}
          onPress={() => setCurrentPage('analytics')}
        />
      </View>

      {/* Sensor Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Status Sensor</Text>
        <View style={styles.statusGrid}>
          <StatusCard 
            title="Suhu"
            value={sensorData.temperature.toFixed(1)}
            unit="°C"
            color="#EF4444"
            icon="🌡️"
            onPress={() => Alert.alert('Sensor Suhu', `Suhu saat ini: ${sensorData.temperature.toFixed(1)}°C\nStatus: ${sensorData.temperature > 30 ? 'Tinggi' : 'Normal'}`)}
          />
          <StatusCard 
            title="Kelembaban"
            value={sensorData.humidity.toFixed(0)}
            unit="%"
            color="#3B82F6"
            icon="💧"
            onPress={() => Alert.alert('Sensor Kelembaban', `Kelembaban saat ini: ${sensorData.humidity.toFixed(0)}%\nStatus: ${sensorData.humidity > 80 ? 'Tinggi' : 'Normal'}`)}
          />
          <StatusCard 
            title="pH Level"
            value={sensorData.ph.toFixed(1)}
            unit=""
            color="#8B5CF6"
            icon="⚗️"
            onPress={() => Alert.alert('Sensor pH', `pH Level saat ini: ${sensorData.ph.toFixed(1)}\nStatus: ${sensorData.ph >= 6 && sensorData.ph <= 7 ? 'Optimal' : 'Perlu Perhatian'}`)}
          />
          <StatusCard 
            title="Berat"
            value={sensorData.weight.toFixed(1)}
            unit="kg"
            color="#10B981"
            icon="⚖️"
            onPress={() => Alert.alert('Sensor Berat', `Berat total: ${sensorData.weight.toFixed(1)} kg\nKapasitas gudang masih tersedia.`)}
          />
        </View>
      </View>

      {/* Recent Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Peringatan Terbaru</Text>
        {alerts.slice(0, 2).map(alert => (
          <AlertItem 
            key={alert.id}
            alert={alert}
            onPress={(alert) => {
              setSelectedAlert(alert);
              setShowAlertDetail(true);
            }}
          />
        ))}
      </View>
    </ScrollView>
  );

  // Products Page
  const renderProducts = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Produk Saya</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddProduct(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+ Tambah</Text>
        </TouchableOpacity>
      </View>

      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onDetail={(product) => {
            setSelectedProduct(product);
            setShowProductDetail(true);
          }}
          onSell={(product) => {
            setSelectedProduct(product);
            // Extract price number from format like "45.000/kg" or "6.500/kg"
            const priceMatch = product.price.match(/[\d.,]+/);
            const cleanPrice = priceMatch ? priceMatch[0] : '';
            setSellForm({ quantity: '', pricePerKg: cleanPrice, totalPrice: '0' });
            setShowSellProduct(true);
          }}
        />
      ))}
    </ScrollView>
  );

  // Alerts Page
  const renderAlerts = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Semua Peringatan</Text>
      
      {alerts.map(alert => (
        <AlertItem 
          key={alert.id}
          alert={alert}
          onPress={(alert) => {
            setSelectedAlert(alert);
            setShowAlertDetail(true);
          }}
        />
      ))}
    </ScrollView>
  );

  // Analytics Page
  const renderAnalytics = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Analitik</Text>
      
      {/* Performance Cards */}
      <View style={styles.quickStatsContainer}>
        <QuickStat 
          label="Efisiensi"
          value="94%"
          subtitle="↗ +5% minggu ini"
          gradientColors={['#10B981', '#059669']}
          onPress={() => Alert.alert('Efisiensi', 'Efisiensi sistem: 94%\nMeningkat 5% dari minggu lalu\n\nFaktor utama:\n- Monitoring realtime\n- Respon cepat terhadap alert')}
        />
        <QuickStat 
          label="Penghematan"
          value="2.4M"
          subtitle="↗ +12% bulan ini"
          gradientColors={['#8B5CF6', '#7C3AED']}
          onPress={() => Alert.alert('Penghematan', 'Total penghematan: Rp 2.4M\nMeningkat 12% dari bulan lalu\n\nSumber penghematan:\n- Reduksi limbah 18%\n- Efisiensi energi 15%')}
        />
      </View>

      {/* Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Metrik Kinerja</Text>
        <View style={styles.metricsList}>
          <TouchableOpacity style={styles.metricRow} onPress={() => Alert.alert('Pengurangan Limbah', 'Berhasil mengurangi limbah hingga 18% melalui:\n- Monitoring kualitas realtime\n- Prediksi masa simpan\n- Optimasi penyimpanan')}>
            <Text style={styles.metricLabel}>Pengurangan Limbah</Text>
            <Text style={[styles.metricValue, { color: '#10B981' }]}>18%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.metricRow} onPress={() => Alert.alert('Akurasi Prediksi', 'Sistem AI mencapai akurasi 87% dalam:\n- Prediksi kualitas produk\n- Estimasi masa simpan\n- Deteksi dini masalah')}>
            <Text style={styles.metricLabel}>Akurasi Prediksi</Text>
            <Text style={[styles.metricValue, { color: '#3B82F6' }]}>87%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.metricRow} onPress={() => Alert.alert('Waktu Respons', 'Sistem merespons alert dalam waktu kurang dari 2 menit:\n- Notifikasi push instant\n- SMS emergency < 30 detik\n- Email alert < 1 menit')}>
            <Text style={styles.metricLabel}>Waktu Respons</Text>
            <Text style={[styles.metricValue, { color: '#F59E0B' }]}>{'< 2 menit'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.metricRow} onPress={() => Alert.alert('Uptime Sistem', 'Sistem berjalan stabil dengan uptime 99.2%:\n- Downtime hanya 6 jam/bulan\n- Maintenance terjadwal\n- Backup system aktif')}>
            <Text style={styles.metricLabel}>Uptime Sistem</Text>
            <Text style={[styles.metricValue, { color: '#8B5CF6' }]}>99.2%</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chart Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Tren Kualitas</Text>
        <TouchableOpacity 
          style={styles.chartContainer}
          onPress={() => Alert.alert('Grafik Tren', 'Grafik menunjukkan tren kualitas produk 30 hari terakhir:\n\n📈 Trend naik 15%\n🌟 Kualitas rata-rata 8.5/10\n🎯 Target tercapai 94%')}
          activeOpacity={0.7}
        >
          <Text style={styles.chartIcon}>📈</Text>
          <Text style={styles.chartText}>Grafik Tren Kualitas</Text>
          <Text style={styles.chartSubtext}>Data 30 hari terakhir</Text>
          <Text style={styles.chartSubtext}>Tap untuk detail</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Settings Page
  const renderSettings = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Pengaturan</Text>
      
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Profil UMKM</Text>
        <TouchableOpacity style={styles.settingsCard} onPress={() => Alert.alert('Edit Profil', 'Fitur edit profil akan segera hadir!')}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Nama UMKM</Text>
            <Text style={styles.settingValue}>UMKM Berkah Tani</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Alamat</Text>
            <Text style={styles.settingValue}>Jl. Soekarno Hatta No. 123, Balikpapan</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Telepon</Text>
            <Text style={styles.settingValue}>+62 812-3456-7890</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Sensor Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Pengaturan Sensor</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.toggleItem} onPress={() => Alert.alert('Interval Sensor', 'Pilih interval pengukuran:\n• 5 menit (saat ini)\n• 10 menit\n• 15 menit\n• 30 menit')}>
            <Text style={styles.toggleLabel}>Interval Pengukuran</Text>
            <Text style={styles.settingValue}>5 menit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleItem} onPress={() => Alert.alert('Batas Suhu', 'Batas suhu maksimal saat ini: 30°C\n\nTap untuk mengubah batas peringatan.')}>
            <Text style={styles.toggleLabel}>Batas Suhu Maksimal</Text>
            <Text style={styles.settingValue}>30°C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleItem} onPress={() => Alert.alert('Batas Kelembaban', 'Batas kelembaban maksimal saat ini: 80%\n\nTap untuk mengubah batas peringatan.')}>
            <Text style={styles.toggleLabel}>Batas Kelembaban Maksimal</Text>
            <Text style={styles.settingValue}>80%</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Notifikasi</Text>
        <View style={styles.settingsCard}>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={(value) => {
                setNotifications(value);
                Alert.alert('Notifikasi', value ? 'Push notifications diaktifkan' : 'Push notifications dinonaktifkan');
              }}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor={notifications ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Email Alerts</Text>
            <Switch
              value={emailAlerts}
              onValueChange={(value) => {
                setEmailAlerts(value);
                Alert.alert('Email Alert', value ? 'Email alerts diaktifkan' : 'Email alerts dinonaktifkan');
              }}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor={emailAlerts ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>SMS Emergency</Text>
            <Switch
              value={smsEmergency}
              onValueChange={(value) => {
                setSmsEmergency(value);
                Alert.alert('SMS Emergency', value ? 'SMS emergency diaktifkan' : 'SMS emergency dinonaktifkan');
              }}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor={smsEmergency ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.aboutButton}
          onPress={() => Alert.alert('Tentang Aplikasi', 'Smart Farm Monitor v1.0\n\nDikembangkan untuk UMKM Berkah Tani\nMembantu monitoring dan pengelolaan produk pertanian secara real-time.\n\n© 2025 Smart Farm Solutions')}
          activeOpacity={0.7}
        >
          <Text style={styles.aboutButtonText}>ℹ️ Tentang Aplikasi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'dashboard': return renderDashboard();
      case 'products': return renderProducts();
      case 'alerts': return renderAlerts();
      case 'analytics': return renderAnalytics();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Smart Farm Monitor</Text>
        <Text style={styles.headerTime}>{currentTime}</Text>
      </View>

      {/* Content */}
      <View style={styles.mainContent}>
        {renderCurrentPage()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavButton icon="🏠" label="Beranda" pageId="dashboard" />
        <NavButton icon="📦" label="Produk" pageId="products" />
        <NavButton icon="🔔" label="Alert" pageId="alerts" badge={unresolvedAlerts > 0 ? unresolvedAlerts.toString() : null} />
        <NavButton icon="📊" label="Analitik" pageId="analytics" />
        <NavButton icon="⚙️" label="Setting" pageId="settings" />
      </View>

      {/* Modals */}
      <AddProductModal />
      <ProductDetailModal />
      <SellProductModal />
      <AlertDetailModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    paddingVertical: 20,
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  farmHeader: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  farmLocation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  farmStatus: {
    alignItems: 'flex-end',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginRight: 6,
  },
  onlineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  currentTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickStatCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickStatGradient: {
    padding: 16,
    alignItems: 'center',
  },
  quickStatLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickStatValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  quickStatSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: (screenWidth - 52) / 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    fontSize: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statusUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  resolvedText: {
    fontSize: 12,
    color: '#10B981',
  },
  alertButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productWeight: {
    fontSize: 14,
    color: '#6B7280',
  },
  productRight: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qualityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  productActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  sellButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sellButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  metricsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  chartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  chartSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  aboutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButtonActive: {
    backgroundColor: '#F0FDF4',
  },
  navIconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIconActive: {
    transform: [{ scale: 1.1 }],
  },
  navLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  emojiSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  emojiOption: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  emojiSelected: {
    backgroundColor: '#10B981',
  },
  emojiText: {
    fontSize: 24,
  },
  qualitySelector: {
    marginBottom: 20,
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  qualityOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  qualitySelected: {
    backgroundColor: '#10B981',
  },
  qualityOptionText: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
  },
  qualitySelectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Product Detail Modal
  productDetailContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  productDetailEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  productDetailName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  productDetailInfo: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  productDetailDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  
  // Sell Modal
  sellSummary: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  sellProductName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sellAvailable: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  
  // Alert Detail Modal
  alertDetailContainer: {
    paddingVertical: 20,
  },
  alertDetailIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  alertDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertDetailTime: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  alertDetailDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  alertDetailAction: {
    fontSize: 14,
    color: '#059669',
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});