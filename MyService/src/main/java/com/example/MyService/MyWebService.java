package com.example.MyService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyWebService {

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public String hello(){
        return "hello";
    }

}
