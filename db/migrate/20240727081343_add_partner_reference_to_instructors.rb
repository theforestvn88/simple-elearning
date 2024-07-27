class AddPartnerReferenceToInstructors < ActiveRecord::Migration[7.1]
  def change
    add_reference :instructors, :partner, index: { unique: true }, foreign_key: true
  end
end
