package com.demo.time;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/*")
@RestController
public class TimeController {
	
    @Autowired
    private TimeService timeService;

    @RequestMapping(value = "/time", method = RequestMethod.GET)
    public ResponseEntity<Time> getCafes(@RequestParam(required = false) Integer hierarchy_id, @RequestParam(required = false) Integer org_id) {
        return new ResponseEntity<>(timeService.getTime(), HttpStatus.OK);
    }
}
