
import React, { useState, useEffect } from 'react';
import { User, Product, VerificationStatus, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, Trash2, Package, Plus, X, Layout, Eye, EyeOff, Save, Image as ImageIcon, Tag, Hash, FileText, Activity, Gavel, Monitor, Smartphone, UserPlus, Shield, Lock, Mail, User as UserIcon, Phone, MapPin } from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  products: Product[];
  onUpdateUser: (userId: string, status: VerificationStatus) => void;
  onDeleteUser: (userId: string) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onCreateUser: (user: User) => void;
  quickAdd?: 'NEW' | 'RESELLER' | null;
  resetQuickAdd?: () => void;
  visibility: {
    newArrivals: boolean;
    certifiedPreOwned: boolean;
    liveAuctions: boolean;
  };
  onUpdateVisibility: (visibility: { newArrivals: boolean; certifiedPreOwned: boolean; liveAuctions: boolean }) => void;
}

const salesData = [
  { name: 'Mon', sales: 400000, bids: 240000 },
  { name: 'Tue', sales: 300000, bids: 139800 },
  { name: 'Wed', sales: 200000, bids: 980000 },
  { name: 'Thu', sales: 278000, bids: 390800 },
  { name: 'Fri', sales: 189000, bids: 480000 },
  { name: 'Sat', sales: 239000, bids: 380000 },
  { name: 'Sun', sales: 349000, bids: 430000 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, products, onUpdateUser, onDeleteUser, onAddProduct, onUpdateProduct, onDeleteProduct, onCreateUser,
  quickAdd, resetQuickAdd, visibility, onUpdateVisibility
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'inventory' | 'analytics' | 'settings'>('users');
  const [inventorySubTab, setInventorySubTab] = useState<'all' | 'new' | 'reseller' | 'auctions'>('all');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    role: UserRole.USER,
    verificationStatus: VerificationStatus.APPROVED
  });

  useEffect(() => {
    if (quickAdd) {
      setActiveTab('inventory');
      handleAddNewWithCondition(quickAdd);
      if (resetQuickAdd) resetQuickAdd();
    }
  }, [quickAdd]);

  const handleEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setIsAdding(false);
  };

  const handleAddNewWithCondition = (condition: 'NEW' | 'RESELLER', asAuction: boolean = false) => {
    setEditingProduct({
      title: '',
      brand: '',
      category: 'Mobiles',
      basePrice: 0,
      discountPercentage: 0,
      stock: 1,
      isBiddable: asAuction,
      description: '',
      images: ['https://picsum.photos/seed/gadget/800/600'],
      specs: { 'Brand': '' },
      condition: condition
    });
    setIsAdding(true);
  };

  const closeForm = () => {
    setEditingProduct(null);
    setIsAdding(false);
  };

  const saveProduct = () => {
    if (editingProduct && editingProduct.title && editingProduct.brand) {
      const productToSave = {
        ...editingProduct,
        id: editingProduct.id || `p${Date.now()}`,
      } as Product;

      if (isAdding) {
        onAddProduct(productToSave);
      } else {
        onUpdateProduct(productToSave);
      }
      closeForm();
    } else {
      alert("Please fill in at least Title and Brand.");
    }
  };

  const handleCreateUserSubmit = () => {
    if (newUser.name && newUser.email && newUser.password) {
      const userToCreate = {
        ...newUser,
        id: `u${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      } as User;
      onCreateUser(userToCreate);
      setNewUser({
        name: '',
        email: '',
        mobile: '',
        address: '',
        password: '',
        role: UserRole.USER,
        verificationStatus: VerificationStatus.APPROVED
      });
      setShowUserForm(false);
    } else {
      alert("Please fill in Name, Email and Password.");
    }
  };

  const updateProductField = (field: keyof Product, value: any) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

  const toggleVisibility = (key: keyof typeof visibility) => {
    onUpdateVisibility({
      ...visibility,
      [key]: !visibility[key]
    });
  };

  const filteredProducts = products.filter(p => {
    if (inventorySubTab === 'all') return true;
    if (inventorySubTab === 'new') return p.condition === 'NEW' && !p.isBiddable;
    if (inventorySubTab === 'reseller') return p.condition === 'RESELLER';
    if (inventorySubTab === 'auctions') return p.isBiddable;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Hub</h1>
          <p className="text-gray-500 mt-2 font-medium">Full marketplace control and verified monitoring.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'users' && !showUserForm && (
            <button 
              onClick={() => setShowUserForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
            >
              <UserPlus size={20} /> Create New User
            </button>
          )}
          {activeTab === 'inventory' && !editingProduct && (
            <>
               <button 
                onClick={() => handleAddNewWithCondition('NEW', true)}
                className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-100 transition-all flex items-center gap-2 border border-indigo-100"
              >
                <Gavel size={20} /> New Auction
              </button>
              <button 
                onClick={() => handleAddNewWithCondition('RESELLER')}
                className="bg-amber-50 text-amber-700 px-6 py-3 rounded-2xl font-bold hover:bg-amber-100 transition-all flex items-center gap-2 border border-amber-100"
              >
                <Smartphone size={20} /> Add Pre-Owned
              </button>
              <button 
                onClick={() => handleAddNewWithCondition('NEW')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
              >
                <Plus size={20} /> Add New Hub Item
              </button>
            </>
          )}
        </div>
      </div>

      {!editingProduct && !showUserForm && (
        <div className="flex border-b border-gray-100 mb-8 overflow-x-auto scrollbar-hide gap-8">
          {['users', 'inventory', 'analytics', 'settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 font-black text-xs uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {showUserForm ? (
        <div className="bg-white rounded-[40px] border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-w-2xl mx-auto">
          <div className="bg-gray-50 px-10 py-8 border-b border-gray-100 flex justify-between items-center">
             <h2 className="text-2xl font-black text-gray-900">Provision New Hub User</h2>
             <button onClick={() => setShowUserForm(false)} className="text-gray-400 hover:text-gray-900 p-2 bg-white rounded-2xl shadow-sm border border-gray-100"><X size={24} /></button>
          </div>
          <div className="p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold" placeholder="Johnathan Doe" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Mobile</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="tel" value={newUser.mobile} onChange={e => setNewUser({...newUser, mobile: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold" placeholder="9876543210" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">System Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold" placeholder="••••••••" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Role Allocation</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold appearance-none">
                    <option value={UserRole.USER}>Standard Hub Member</option>
                    <option value={UserRole.ADMIN}>Hub System Administrator</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Home Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold" placeholder="123 Tech Avenue, Circuit City" />
              </div>
            </div>
            <button onClick={handleCreateUserSubmit} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl flex items-center justify-center gap-3"><UserPlus size={24} /> Create Account Login</button>
          </div>
        </div>
      ) : editingProduct ? (
        <div className="bg-white rounded-[40px] border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-w-4xl mx-auto">
          <div className="bg-gray-50 px-10 py-8 border-b border-gray-100 flex justify-between items-center">
             <h2 className="text-2xl font-black text-gray-900">{isAdding ? 'Create Hub Listing' : `Modify Listing`}</h2>
             <button onClick={closeForm} className="text-gray-400 hover:text-gray-900 p-2 bg-white rounded-2xl shadow-sm border border-gray-100"><X size={24} /></button>
          </div>
          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Gadget Title</label>
                <input type="text" value={editingProduct.title} onChange={(e) => updateProductField('title', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold" placeholder="e.g. Sony A7 IV" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Brand</label>
                <input type="text" value={editingProduct.brand} onChange={(e) => updateProductField('brand', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold" placeholder="e.g. Sony" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Hub Price (₹)</label>
                <input type="number" value={editingProduct.basePrice} onChange={(e) => updateProductField('basePrice', Number(e.target.value))} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-black text-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Sale Type</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                   <button onClick={() => updateProductField('isBiddable', true)} className={`py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${editingProduct.isBiddable ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>Auction</button>
                   <button onClick={() => updateProductField('isBiddable', false)} className={`py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${!editingProduct.isBiddable ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>Direct</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Listing Condition</label>
                <select value={editingProduct.condition} onChange={(e) => updateProductField('condition', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold">
                  <option value="NEW">New - In Box</option>
                  <option value="RESELLER">Reseller - Inspected</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Stock Level</label>
                <input type="number" value={editingProduct.stock} onChange={(e) => updateProductField('stock', Number(e.target.value))} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold" />
              </div>
            </div>
            <button onClick={saveProduct} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3"><Save size={24} /> Confirm and List Gadget</button>
          </div>
        </div>
      ) : activeTab === 'inventory' ? (
        <div className="space-y-8">
          <div className="flex gap-4 p-2 bg-white rounded-3xl border border-gray-100 w-max shadow-sm">
            {['all', 'new', 'reseller', 'auctions'].map(sub => (
              <button 
                key={sub}
                onClick={() => setInventorySubTab(sub as any)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${inventorySubTab === sub ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
              >
                {sub}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-[32px] p-6 flex gap-6 hover:border-indigo-600 transition-all cursor-pointer group shadow-sm hover:shadow-xl" onClick={() => handleEdit(p)}>
                <div className="relative h-24 w-24 shrink-0 rounded-3xl overflow-hidden bg-gray-50">
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute top-2 left-2 px-2 py-0.5 text-[8px] font-black rounded uppercase ${p.condition === 'NEW' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}>{p.condition}</div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{p.brand}</p>
                    <p className="font-bold text-gray-900 truncate text-sm mt-0.5">{p.title}</p>
                    <p className="text-base font-black text-gray-900 mt-2">₹{p.basePrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.isBiddable && <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase">Auction</span>}
                    <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded uppercase">Stock: {p.stock}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(p); }} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm"><Layout size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteProduct(p.id); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'users' ? (
        <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profile</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Trust Tier</th>
                <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Control</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 font-bold">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-10 py-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-black">{user.name.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900">{user.name}</p>
                        {user.role === UserRole.ADMIN && <Shield size={12} className="text-indigo-600" />}
                      </div>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest ${user.verificationStatus === VerificationStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{user.verificationStatus}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      {user.verificationStatus === VerificationStatus.PENDING && (
                        <button onClick={() => onUpdateUser(user.id, VerificationStatus.APPROVED)} className="p-3 text-green-600 bg-green-50 rounded-2xl transition-all shadow-sm"><CheckCircle size={20} /></button>
                      )}
                      <button onClick={() => onDeleteUser(user.id)} className="p-3 text-red-500 bg-red-50 rounded-2xl transition-all shadow-sm"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'settings' ? (
        <div className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-sm space-y-12">
           <div className="flex items-center gap-4">
             <div className="bg-indigo-100 p-4 rounded-3xl text-indigo-600"><Monitor size={32} /></div>
             <div><h2 className="text-2xl font-black text-gray-900 tracking-tight">Market Segment Control</h2><p className="text-gray-500 font-medium">Define which columns are exposed on the homepage grid.</p></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(Object.keys(visibility) as (keyof typeof visibility)[]).map(key => (
                <button key={key} onClick={() => toggleVisibility(key)} className={`p-10 rounded-[40px] border-4 transition-all flex flex-col items-center gap-6 text-center group ${visibility[key] ? 'border-indigo-600 bg-indigo-50/50 shadow-2xl shadow-indigo-100/50' : 'border-gray-50 bg-gray-50 opacity-40'}`}>
                  <div className={`p-6 rounded-[28px] transition-all group-hover:scale-110 ${visibility[key] ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-white'}`}>{visibility[key] ? <Eye size={40} /> : <EyeOff size={40} />}</div>
                  <div><p className="text-lg font-black text-gray-900 uppercase tracking-tight">{key.replace(/([A-Z])/g, ' $1').trim()}</p><p className="text-xs text-gray-500 mt-2 font-medium">Public visibility toggled {visibility[key] ? 'ON' : 'OFF'}</p></div>
                </button>
              ))}
           </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-sm">
           <h3 className="text-2xl font-black mb-8">Performance Analytics</h3>
           <div className="h-96">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={salesData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} /><Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'}} cursor={{fill: '#f8fafc'}} /><Bar dataKey="sales" fill="#4f46e5" radius={[12, 12, 0, 0]} barSize={40} /></BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
