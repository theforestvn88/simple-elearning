class AddPartnerReferenceToInstructors < ActiveRecord::Migration[7.1]
  def change
    add_reference :instructors, :partner, null: false, foreign_key: true
  end
end
