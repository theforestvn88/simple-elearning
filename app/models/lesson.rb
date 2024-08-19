class Lesson < ApplicationRecord
  belongs_to :milestone
  belongs_to :course
  belongs_to :instructor

  validates :name, presence: true
  validates :estimated_minutes, numericality: { greater_than_or_equal_to: 1, only_integer: true, allow_nil: false }

  after_save :update_milestone_stats_and_counters

  scope :search_by_milestone, lambda { |milestone_id| where(milestone_id: milestone_id) }
  scope :short_intro, lambda { select(:id, :name, :estimated_minutes) }

  include PositionalOrdering
  set_position_scope :milestone_id

  private

    def update_milestone_stats_and_counters
      if previously_new_record?
        self.milestone.lessons_count += 1
      end
      
      if estimated_minutes_previously_changed?
        self.milestone.estimated_minutes += self.estimated_minutes - self.estimated_minutes_previously_was
      end

      self.milestone.save
    end
end
