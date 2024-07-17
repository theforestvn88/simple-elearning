# require Rails.root.join('lib/redis/config')

# Sidekiq.configure_client do |config|
#     config.redis = Redis::Config.app
# end

# Sidekiq.configure_server do |config|
#     config.logger.formatter = Sidekiq::Logger::Formatters::JSON.new
#     config.logger.level = Logger.const_get(ENV.fetch('LOG_LEVEL', 'info').upcase.to_s)
#     config.redis = Redis::Config.app
# end

# schedule_file = 'config/schedule.yml'
# Rails.application.reloader.to_prepare do
#     Sidekiq::Cron::Job.load_from_hash YAML.load_file(schedule_file) if File.exist?(schedule_file) && Sidekiq.server?
# end
