class PurgeUnattachedBlobsJob < ApplicationJob
  queue_as :active_storage_purge

  def perform(configs)
    ActiveStorage::Blob.unattached.where(created_at: ..configs["period_in_days"].days.ago).find_each(&:purge_later)
  end
end
