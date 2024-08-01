FactoryBot.define do
  factory :course do
    sequence(:name) { |n| "course #{n}" }
    sequence(:summary) { |n| "summary course #{n}" }
    sequence(:description) { |n| "description course #{n}" }
    association :instructor
    association :partner
  end
end
