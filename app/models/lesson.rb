# frozen_string_literal: true

class Lesson < ApplicationRecord
  include Assignable
  
  belongs_to :milestone
  belongs_to :course
  belongs_to :instructor

  has_rich_text :content

  validates :name, presence: true
  validates :estimated_minutes, numericality: { greater_than_or_equal_to: 1, only_integer: true, allow_nil: false }

  scope :search_by_milestone, lambda { |milestone_id| where(milestone_id: milestone_id) }
  scope :short_intro, lambda { select(:id, :name, :estimated_minutes) }

  after_save :update_stats_and_counters
  after_destroy :update_stats_and_counters
  

  include PositionalOrdering
  set_position_scope :milestone_id

  private

    def update_stats_and_counters
      if previously_new_record?
        self.milestone.lessons_count += 1
        self.course.lessons_count += 1
      end
      
      if estimated_minutes_previously_changed?
        changed = self.estimated_minutes - self.estimated_minutes_previously_was
        self.milestone.estimated_minutes += changed
        self.course.estimated_minutes += changed
      end

      if destroyed?
        self.milestone.estimated_minutes -= self.estimated_minutes
        self.course.estimated_minutes -= self.estimated_minutes
      end

      self.milestone.save
      self.course.save
    end
end
