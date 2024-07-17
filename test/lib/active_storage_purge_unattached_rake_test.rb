require 'test_helper'

class ActiveStoragePurgeUnattachedRakeTest < ActiveSupport::TestCase
    include ActiveJob::TestHelper

    test 'should perform PurgeUnattachedBlobsJob' do
        Rails.application.load_tasks

        job_perform_spy = Minitest::Mock.new
        job_perform_spy.expect :call, nil, [{"period_in_days"=>7}]
        PurgeUnattachedBlobsJob.stub :perform_now, job_perform_spy do
            Rake::Task['active_storage:purge_unattached'].invoke
        end

        job_perform_spy.verify
    end
end
