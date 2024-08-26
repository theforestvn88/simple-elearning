# frozen_string_literal: true

require 'test_helper'
require_relative './shared/send_email_tests'

class AssignmentMailerTest < ActionMailer::TestCase
  include ::Shared::SendEmailTests
  
  setup do
    @partner = create(:partner)
    @admin = create(:instructor, partner: @partner, rank: :administrator)
    @professor = create(:instructor, partner: @partner, rank: :professor)
    @course = create(:course, instructor: @admin, partner: @partner)

    @assignment = create(:assignment, assignable: @course, assignee: @professor)
  end

  test 'inform new assignment' do
    mailer = AssignmentMailer.with(assignment: @assignment).inform_new_assignment
    assert_send_email(from_mailer: mailer, to: [@professor.email], with_subject: 'Inform New Assignment')
  end

  test 'inform cancel assignment' do
    mailer = AssignmentMailer.with(assignment: @assignment).inform_cancel_assignment
    assert_send_email(from_mailer: mailer, to: [@professor.email], with_subject: 'Inform Cancel Assignment')
  end
end
