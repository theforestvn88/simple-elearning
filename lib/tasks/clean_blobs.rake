namespace :active_storage do
    desc "Purges unattached Active Storage blobs."
    # rake active_storage:purge_unattached period_in_days=30
    task purge_unattached: :environment do
      configs = {}
      configs['period_in_days'] = ENV['period_in_days']&.to_i || 7
      PurgeUnattachedBlobsJob.perform_now(configs)
    end
end
