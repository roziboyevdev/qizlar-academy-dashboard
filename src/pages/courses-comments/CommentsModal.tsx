import React, { useState } from 'react';
import { X, Star, Calendar, User } from 'lucide-react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comment: {
    id: string;
    content: string;
    value: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    user: {
      firstname: string;
      lastname: string;
      photoUrl?: string;
    };
    createdAt?: string;
  } | null;
  onStatusChange: (commentId: string, newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, comment, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(comment?.status || 'PENDING');

  if (!isOpen || !comment) return null;

  const handleStatusChange = (newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    setSelectedStatus(newStatus);
    onStatusChange(comment.id, newStatus);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      APPROVED: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        label: 'Tasdiqlangan'
      },
      REJECTED: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        label: 'Rad etilgan'
      },
      PENDING: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        label: 'Kutilmoqda'
      }
    };
    return badges[status as keyof typeof badges] || badges.PENDING;
  };

  const statusBadge = getStatusBadge(comment.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Izoh tafsilotlari</h2>
              <p className="text-sm text-gray-600 mt-1">Foydalanuvchi fikri va baholash</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
          </div>
          
          {/* Status Badge */}
          <div className="mt-4">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-280px)] px-8 py-6">
          <div className="space-y-6">
            
            {/* User Info Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-4">
                {comment.user.photoUrl ? (
                  <img
                    src={comment.user.photoUrl}
                    alt={comment.user.firstname}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-4 ring-white shadow-md">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {comment.user.firstname} {comment.user.lastname}
                  </h3>
                  {comment.createdAt && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(comment.createdAt).toLocaleDateString('uz-UZ', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Star className="w-4 h-4 text-amber-500" />
                Baholash
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-7 h-7 transition-all ${
                        star <= comment.value 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-2xl font-bold text-gray-900">{comment.value}</span>
                  <span className="text-gray-500 font-medium">/5</span>
                </div>
              </div>
            </div>

            {/* Comment Content */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Izoh matni
              </label>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                  {comment.content}
                </p>
              </div>
            </div>

            {/* Status Change Section */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <label className="text-sm font-semibold text-gray-700 mb-4 block">
                Statusni o'zgartirish
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleStatusChange('PENDING')}
                  className={`relative py-3.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                    selectedStatus === 'PENDING'
                      ? 'bg-amber-100 text-amber-800 border-2 border-amber-400 shadow-md scale-105'
                      : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  {selectedStatus === 'PENDING' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full ring-2 ring-white" />
                  )}
                  Kutilmoqda
                </button>
                <button
                  onClick={() => handleStatusChange('APPROVED')}
                  className={`relative py-3.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                    selectedStatus === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 shadow-md scale-105'
                      : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {selectedStatus === 'APPROVED' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                  Tasdiqlash
                </button>
                <button
                  onClick={() => handleStatusChange('REJECTED')}
                  className={`relative py-3.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                    selectedStatus === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800 border-2 border-rose-400 shadow-md scale-105'
                      : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  {selectedStatus === 'REJECTED' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full ring-2 ring-white" />
                  )}
                  Rad etish
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};

export default CommentModal;