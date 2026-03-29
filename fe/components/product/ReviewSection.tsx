'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Pencil, Trash2 } from 'lucide-react';
import { useProductReviews, useMyReview, useCreateReview, useUpdateReview, useDeleteReview, useVoteReview } from '@/hooks/useReviews';
import { useAuthStore } from '@/stores/useAuthStore';

interface Props {
  productId: string;
}

function StarRating({ value, onChange, size = 'md' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'md' }) {
  const px = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          disabled={!onChange}
          className={`${px} transition ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star className={`${px} ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}`} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId }: Props) {
  const user = useAuthStore((s) => s.user);
  const { data: reviewsData, isLoading } = useProductReviews(productId);
  const { data: myReview } = useMyReview(productId);
  const { mutate: createReview, isPending: isCreating } = useCreateReview();
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();
  const { mutate: deleteReview } = useDeleteReview();
  const { mutate: voteReview } = useVoteReview();

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [editMode, setEditMode] = useState(false);

  const reviews = reviewsData?.data ?? reviewsData ?? [];
  const averageRating = reviewsData?.averageRating ?? '0.0';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editMode && myReview) {
      updateReview({ id: myReview.id, productId, rating, title: title || undefined, comment: comment || undefined });
    } else {
      createReview({ productId, rating, title: title || undefined, comment: comment || undefined });
    }
    setShowForm(false);
    setEditMode(false);
    setRating(5);
    setTitle('');
    setComment('');
  }

  function handleEdit() {
    if (myReview) {
      setRating(myReview.rating);
      setTitle(myReview.title || '');
      setComment(myReview.comment || '');
      setEditMode(true);
      setShowForm(true);
    }
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-amber-100">
          Reviews
          <span className="ml-2 text-sm font-normal text-amber-400/50">
            ★ {parseFloat(averageRating).toFixed(1)} ({Array.isArray(reviews) ? reviews.length : 0})
          </span>
        </h2>
        {user && !myReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-amber-600/20 px-4 py-1.5 text-sm font-medium text-amber-300 transition hover:bg-amber-600/30"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-amber-900/30 bg-amber-950/20 p-5">
          <h3 className="mb-3 text-sm font-semibold text-amber-200">
            {editMode ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <div className="mb-3">
            <label className="mb-1 block text-xs text-amber-400/60">Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-xs text-amber-400/60">Title (optional)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-amber-800/30 bg-amber-950/30 px-3 py-2 text-sm text-amber-50 placeholder-amber-600/40 outline-none focus:border-amber-600/50"
              placeholder="Sum up your experience..."
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-xs text-amber-400/60">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-amber-800/30 bg-amber-950/30 px-3 py-2 text-sm text-amber-50 placeholder-amber-600/40 outline-none focus:border-amber-600/50"
              placeholder="Tell others about your experience..."
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              {isCreating || isUpdating ? 'Saving...' : editMode ? 'Update' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditMode(false); }}
              className="rounded-lg border border-amber-800/30 px-4 py-2 text-sm text-amber-400/70 transition hover:text-amber-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* My review highlight */}
      {myReview && !showForm && (
        <div className="mb-4 rounded-xl border border-amber-700/30 bg-amber-950/30 p-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-amber-400">Your Review</span>
              <StarRating value={myReview.rating} size="sm" />
            </div>
            <div className="flex gap-1">
              <button onClick={handleEdit} className="rounded p-1 text-amber-500/60 transition hover:text-amber-300">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => deleteReview(myReview.id)} className="rounded p-1 text-red-500/60 transition hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          {myReview.title && <p className="text-sm font-medium text-amber-100">{myReview.title}</p>}
          {myReview.comment && <p className="mt-1 text-sm text-amber-100/60">{myReview.comment}</p>}
        </div>
      )}

      {/* Review list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-amber-900/10" />
          ))}
        </div>
      ) : !Array.isArray(reviews) || reviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-amber-400/40">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {reviews
            .filter((r: any) => r.id !== myReview?.id)
            .map((review: any) => {
              const author = review.profiles ?? review.profile;
              return (
                <div key={review.id} className="rounded-xl border border-amber-900/20 bg-amber-950/15 p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-amber-200">
                        {author?.displayName || author?.username || 'User'}
                      </span>
                      <StarRating value={review.rating} size="sm" />
                    </div>
                    <span className="text-xs text-amber-400/30">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.title && <p className="text-sm font-medium text-amber-100">{review.title}</p>}
                  {review.comment && <p className="mt-1 text-sm text-amber-100/60">{review.comment}</p>}
                  {user && (
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => voteReview({ reviewId: review.id, isHelpful: true })}
                        className="flex items-center gap-1 text-xs text-amber-400/40 transition hover:text-amber-300"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" /> Helpful {review.helpful_count > 0 && `(${review.helpful_count})`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
