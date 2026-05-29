package com.stock.broker.system.Repository;

import com.stock.broker.system.Model.CurrentUserSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionDao extends JpaRepository<CurrentUserSession, Integer> {
    CurrentUserSession findByUuid(String uuid);
    CurrentUserSession findByUserId(Integer userId);
}
