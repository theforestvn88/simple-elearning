require 'test_helper'

class PurgeUnattachedBlobsJobTest < ActiveJob::TestCase
  setup do
    @user = create(:user)
  end

  test 'clean unattached' do
    avatar_file = Rack::Test::UploadedFile.new file_fixture('/images/test_img.png').to_s
    @user.avatar.attach avatar_file
    @user.avatar.attach nil
    
    assert_equal ActiveStorage::Blob.unattached.count, 1

    configs = {}
    configs['period_in_days'] = 0

    perform_enqueued_jobs do
      PurgeUnattachedBlobsJob.perform_later(configs)
    end

    assert_equal ActiveStorage::Blob.unattached.count, 0
  end
end
