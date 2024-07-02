FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "tester#{n}@example.com" }
    password { "0123456789" }
    password_confirmation { "0123456789" }
    name { "tester" }
    location { "location" }
    social_links { "{}" }
    introduction { "introduction" }
    verified { false }
  end
end
