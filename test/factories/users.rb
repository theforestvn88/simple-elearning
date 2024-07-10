FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "tester#{n}@example.com" }
    password { "0123456789" }
    password_confirmation { "0123456789" }
    name { "tester" }
    location { "location" }
    social_links { "[]" }
    introduction { "introduction" }
    verified { false }
  end

  factory :user_with_avatar do
    sequence(:email) { |n| "tester#{n}@example.com" }
    password { "0123456789" }
    password_confirmation { "0123456789" }
    name { "tester" }
    location { "location" }
    social_links { "[]" }
    introduction { "introduction" }
    verified { false }
    
    after(:build) do |user|
      user.avatar.attach(
        io: File.open(Rails.root.join('test', 'fixtures', 'files', 'images', 'test_img.png')),
        filename: 'test_img.png',
        content_type: 'image/png'
      )
    end
  end
end
