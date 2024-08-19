# frozen_string_literal: true

module PositionalOrdering
    extend ActiveSupport::Concern

    class_methods do
        def set_position_scope(position_scope_attributes)
            class_attribute :position_scope_attributes
            self.position_scope_attributes = Array(position_scope_attributes)
        end
    end

    included do
        default_scope lambda { order(:position) }

        before_create :set_default_position
        after_save :reorder_positions
        after_destroy :remove_position
    end

    private

        def position_scope
            query = self.class.position_scope_attributes.inject({}) do |h, attr|
                h[attr] = self.send(attr)
                h 
            end
            self.class.unscoped.where(query)
        end

        def set_default_position
            self.position = position_scope.maximum(:position).to_i + 1
        end

        def remove_position(pos = self.position)
            position_scope.where('position >= ? AND id <> ?', pos, self.id).update_all('position = position - 1')
        end

        def reorder_positions
            return if previously_new_record? || !position_previously_changed?
            
            remove_position(self.position_previously_was)
            position_scope.where('position >= ? AND id <> ?', self.position, self.id).update_all('position = position + 1')
        end
end
