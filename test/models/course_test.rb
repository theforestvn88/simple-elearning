require 'test_helper'

class CourseTest < ActiveSupport::TestCase
  context 'associations' do
    should have_one_attached(:cover) 
  end
end
