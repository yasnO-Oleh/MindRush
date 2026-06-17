package DemoApp.example.demo.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.jpa.autoconfigure.EntityManagerFactoryDependsOnPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {

    @Bean(initMethod = "migrate")
    public Flyway flyway(DataSource dataSource) {
        return Flyway.configure()
                .baselineOnMigrate(true)
                .locations("classpath:db/migration")
                .dataSource(dataSource)
                .load();
    }

    @Configuration
    static class FlywayEntityManagerFactoryDependsOnPostProcessor
            extends EntityManagerFactoryDependsOnPostProcessor {

        FlywayEntityManagerFactoryDependsOnPostProcessor() {
            super("flyway");
        }
    }
}
