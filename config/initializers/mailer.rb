Rails.application.configure do
    config.action_mailer.default_url_options = { host: ENV.fetch('WEB_URL', 'localhost'), port: ENV.fetch('WEB_PORT', '3000') }
    config.action_mailer.raise_delivery_errors = false
    config.action_mailer.perform_caching = false
    config.action_mailer.perform_deliveries = true

    unless Rails.env.test?
        smtp_settings = {
            address:        ENV.fetch("SMTP_ADDRESS", 'localhost'),
            port:           ENV.fetch("SMTP_PORT", 587),
            authentication: ENV.fetch("SMTP_AUTHENTICATION", 'plain').to_sym,
            user_name:      ENV.fetch("SMTP_USER_NAME", nil),
            password:       ENV.fetch("SMTP_PASSWORD", nil),
            domain:         ENV.fetch("SMTP_DOMAIN", nil),
        }

        smtp_settings[:enable_starttls_auto] = ActiveModel::Type::Boolean.new.cast(ENV.fetch('SMTP_ENABLE_STARTTLS_AUTO', true))
        smtp_settings[:openssl_verify_mode] = ENV['SMTP_OPENSSL_VERIFY_MODE'] if ENV['SMTP_OPENSSL_VERIFY_MODE'].present?
        smtp_settings[:ssl] = ActiveModel::Type::Boolean.new.cast(ENV.fetch('SMTP_SSL', true)) if ENV['SMTP_SSL']
        smtp_settings[:tls] = ActiveModel::Type::Boolean.new.cast(ENV.fetch('SMTP_TLS', true)) if ENV['SMTP_TLS']
        
        config.action_mailer.delivery_method = :smtp
        config.action_mailer.smtp_settings = smtp_settings
    end
end
