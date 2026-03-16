package com.example.demo.repositories;

import com.example.demo.entities.ComplaintUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintUpdateRepository extends JpaRepository<ComplaintUpdate, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT cu FROM ComplaintUpdate cu WHERE cu.complaint.id = :complaintId ORDER BY cu.timestamp ASC")
    List<ComplaintUpdate> findByComplaintIdOrderByTimestampAsc(@org.springframework.data.repository.query.Param("complaintId") Long complaintId);
}
